#!/usr/bin/env node
/**
 * Яша Learn Code — Page Auditor
 * Проверяет страницы на: 404, broken images, Sandpack ошибки, console errors
 * 
 * Usage: node scripts/audit-pages.js --sections html,css --base-url http://localhost:4010
 */

import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'src/content/docs')

const args = process.argv.slice(2)
const getArg = (name) => {
  const idx = args.indexOf(name)
  return idx !== -1 ? args[idx + 1] : null
}

const SECTIONS = getArg('--sections')?.split(',') || null
const BASE_URL = getArg('--base-url') || 'http://localhost:4010'
const OUTPUT_FILE = getArg('--output') || path.join(ROOT, 'audit-report.json')
const TIMEOUT = parseInt(getArg('--timeout') || '20000')
const HEADLESS = !args.includes('--headed')

// Получить URL страницы из MDX файла
function mdxToUrl(section, filename) {
  const slug = filename.replace(/\.mdx$/, '')
  return `${BASE_URL}/${section}/${slug}/`
}

// Получить все MDX файлы по секциям
function getPages(sections) {
  const pages = []
  const dirs = sections
    ? sections.map(s => path.join(CONTENT_DIR, s))
    : fs.readdirSync(CONTENT_DIR)
        .filter(d => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory())
        .map(d => path.join(CONTENT_DIR, d))

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      console.warn(`⚠ Section not found: ${dir}`)
      continue
    }
    const section = path.basename(dir)
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
    for (const file of files) {
      pages.push({ section, file, url: mdxToUrl(section, file) })
    }
  }
  return pages
}

// Проверить одну страницу
async function auditPage(page, { section, file, url }) {
  const errors = []
  const warnings = []
  const consoleErrors = []

  // Слушаем console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  // Слушаем page errors (uncaught exceptions)
  const pageErrors = []
  page.on('pageerror', err => pageErrors.push(err.message))

  // Слушаем failed requests
  const failedRequests = []
  page.on('requestfailed', req => {
    const url = req.url()
    if (!url.includes('hot-update') && !url.includes('webpack-hmr')) {
      failedRequests.push({ url, failure: req.failure()?.errorText })
    }
  })

  let status = 0
  let loadTime = 0

  try {
    const start = Date.now()
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT,
    })
    loadTime = Date.now() - start
    status = response?.status() || 0

    if (status >= 400) {
      errors.push(`HTTP ${status}`)
      return { url, section, file, status, errors, warnings, consoleErrors, pageErrors, loadTime, ok: false }
    }

    // Ждём пока страница стабилизируется
    await page.waitForTimeout(2000)

    // 1. Проверить картинку урока
    const images = await page.$$eval('img', imgs =>
      imgs.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        complete: img.complete,
        alt: img.alt,
      }))
    )

    const lessonImages = images.filter(img =>
      img.src.includes('/lessons/') || img.src.includes('/public/lessons/')
    )

    if (lessonImages.length === 0) {
      warnings.push('No lesson image found')
    } else {
      for (const img of lessonImages) {
        if (!img.complete || img.naturalWidth === 0) {
          errors.push(`Broken image: ${img.src}`)
        }
      }
    }

    // 2. Проверить Sandpack playground
    const hasSandpack = await page.$('.sp-wrapper') !== null
    const hasPlaygroundImport = await page.evaluate(() =>
      document.body.innerHTML.includes('sp-wrapper') ||
      document.body.innerHTML.includes('Playground')
    )

    if (hasSandpack) {
      // Проверить нет ли ошибок внутри Sandpack
      const sandpackErrors = await page.$$eval('.sp-overlay-message, [class*="error-message"], .sp-console-item--error', els =>
        els.map(el => el.textContent?.trim()).filter(Boolean)
      )
      if (sandpackErrors.length > 0) {
        errors.push(`Sandpack errors: ${sandpackErrors.slice(0, 2).join(' | ')}`)
      }

      // Проверить что iframe загрузился
      const sandpackFrame = await page.$('.sp-preview-iframe')
      if (!sandpackFrame) {
        warnings.push('Sandpack preview iframe not found')
      }
    }

    // 3. Console errors (фильтруем шум)
    const realConsoleErrors = consoleErrors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('hot-update') &&
      !e.includes('ResizeObserver') &&
      !e.includes('Non-Error') &&
      !e.includes('third-party')
    )
    if (realConsoleErrors.length > 0) {
      errors.push(`Console errors: ${realConsoleErrors.slice(0, 2).join(' | ')}`)
    }

    // 4. Page errors (uncaught)
    if (pageErrors.length > 0) {
      errors.push(`Page errors: ${pageErrors.slice(0, 2).join(' | ')}`)
    }

    // 5. Failed network requests (исключая dev-server шум)
    const criticalFails = failedRequests.filter(r =>
      r.url.includes('/lessons/') ||
      r.url.includes('.js') ||
      r.url.includes('.css')
    )
    if (criticalFails.length > 0) {
      warnings.push(`Failed requests: ${criticalFails.map(r => r.url.split('/').pop()).slice(0, 3).join(', ')}`)
    }

    // 6. Проверить заголовок страницы
    const title = await page.title()
    if (!title || title === 'Untitled') {
      warnings.push('Missing or empty page title')
    }

    // 7. Проверить sidebar — есть ли текущая страница
    const activeInSidebar = await page.$('nav.sidebar a[aria-current="page"]')
    if (!activeInSidebar) {
      warnings.push('Current page not highlighted in sidebar')
    }

  } catch (err) {
    errors.push(`Load failed: ${err.message.slice(0, 100)}`)
    status = 0
  }

  const ok = errors.length === 0
  return {
    url,
    section,
    file,
    status,
    loadTime,
    hasSandpack: undefined, // will be set above
    errors,
    warnings,
    consoleErrors: consoleErrors.slice(0, 3),
    pageErrors: pageErrors.slice(0, 3),
    ok,
  }
}

async function main() {
  console.log(`🔍 Яша Learn Code Auditor`)
  console.log(`📡 Base URL: ${BASE_URL}`)

  const pages = getPages(SECTIONS)
  console.log(`📄 Pages to audit: ${pages.length}`)
  if (SECTIONS) console.log(`📂 Sections: ${SECTIONS.join(', ')}`)

  const browser = await chromium.launch({ headless: HEADLESS })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  })

  const results = []
  let passed = 0, failed = 0, warned = 0

  for (let i = 0; i < pages.length; i++) {
    const pageInfo = pages[i]
    const page = await context.newPage()

    process.stdout.write(`[${i + 1}/${pages.length}] ${pageInfo.section}/${pageInfo.file} ... `)

    const result = await auditPage(page, pageInfo)
    await page.close()

    results.push(result)

    if (!result.ok) {
      failed++
      console.log(`❌ ${result.errors.join(', ')}`)
    } else if (result.warnings.length > 0) {
      warned++
      console.log(`⚠ ${result.warnings.join(', ')}`)
    } else {
      passed++
      console.log(`✅ ${result.loadTime}ms`)
    }
  }

  await browser.close()

  // Summary
  const summary = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    sections: SECTIONS || 'all',
    total: pages.length,
    passed,
    failed,
    warned,
    results,
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2))

  console.log(`\n📊 Results:`)
  console.log(`  ✅ Passed:   ${passed}`)
  console.log(`  ⚠  Warnings: ${warned}`)
  console.log(`  ❌ Failed:   ${failed}`)
  console.log(`  📄 Report:   ${OUTPUT_FILE}`)

  // Print failed pages
  const failures = results.filter(r => !r.ok)
  if (failures.length > 0) {
    console.log(`\n❌ Failed pages:`)
    for (const f of failures) {
      console.log(`  ${f.url}`)
      for (const e of f.errors) console.log(`    → ${e}`)
    }
  }

  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
