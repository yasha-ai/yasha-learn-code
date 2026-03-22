#!/usr/bin/env node
/**
 * Яша Learn Code — Page Auditor
 * 
 * Фаза 1 (fetch): проверяет HTTP статус всех страниц
 * Фаза 2 (playwright): только страницы с Playground — проверяет рендер без ошибок
 * 
 * Usage:
 *   node scripts/audit-pages.js --sections html,css
 *   node scripts/audit-pages.js --sections javascript --base-url https://yashaschool.dyuzhev.dev
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
const BASE_URL = (getArg('--base-url') || 'https://yashaschool.dyuzhev.dev').replace(/\/$/, '')
const OUTPUT_FILE = getArg('--output') || '/tmp/audit-report.json'
const TIMEOUT = parseInt(getArg('--timeout') || '15000')

// MDX slug → URL
function mdxToUrl(section, filename) {
  const slug = filename.replace(/\.mdx$/, '')
  return `${BASE_URL}/${section}/${slug}/`
}

// Читаем MDX и смотрим есть ли Playground
function hasPlayground(section, filename) {
  try {
    const content = fs.readFileSync(path.join(CONTENT_DIR, section, filename), 'utf8')
    return content.includes('<Playground') || content.includes('import { Playground')
  } catch { return false }
}

// Получить все страницы
function getPages() {
  const pages = []
  const dirs = SECTIONS
    ? SECTIONS.map(s => ({ name: s, full: path.join(CONTENT_DIR, s) }))
    : fs.readdirSync(CONTENT_DIR)
        .filter(d => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory())
        .map(d => ({ name: d, full: path.join(CONTENT_DIR, d) }))

  for (const { name, full } of dirs) {
    if (!fs.existsSync(full)) { console.warn(`⚠ Section not found: ${name}`); continue }
    const files = fs.readdirSync(full).filter(f => f.endsWith('.mdx'))
    for (const file of files) {
      pages.push({
        section: name,
        file,
        url: mdxToUrl(name, file),
        hasPlayground: hasPlayground(name, file),
      })
    }
  }
  return pages
}

// Фаза 1: быстрая проверка HTTP статуса через fetch
async function checkHttp(pages) {
  console.log(`\n📡 Phase 1: HTTP check (${pages.length} pages)...`)
  const results = []

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i]
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), TIMEOUT)
      const res = await fetch(p.url, { signal: controller.signal, method: 'HEAD' })
      clearTimeout(timer)

      const ok = res.status < 400
      results.push({ ...p, httpStatus: res.status, httpOk: ok, errors: ok ? [] : [`HTTP ${res.status}`] })
      process.stdout.write(ok ? '.' : `\n❌ ${res.status} ${p.url}\n`)
    } catch (err) {
      results.push({ ...p, httpStatus: 0, httpOk: false, errors: [`Fetch failed: ${err.message.slice(0, 60)}`] })
      process.stdout.write(`\n❌ FAIL ${p.url}\n`)
    }

    // прогресс каждые 50
    if ((i + 1) % 50 === 0) process.stdout.write(` ${i + 1}/${pages.length}\n`)
  }
  console.log(` done\n`)
  return results
}

// Фаза 2: Playwright — только страницы с playground
async function checkPlaygrounds(pages) {
  const playgroundPages = pages.filter(p => p.hasPlayground && p.httpOk)
  if (playgroundPages.length === 0) {
    console.log('📦 No playgrounds found in this batch, skipping Playwright phase.')
    return pages
  }

  console.log(`\n🎭 Phase 2: Playwright check (${playgroundPages.length} pages with Playground)...`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })

  for (const p of playgroundPages) {
    const page = await context.newPage()
    const consoleErrors = []
    const pageErrors = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Фильтруем шум
        if (!text.includes('favicon') && !text.includes('hot-update') && !text.includes('ResizeObserver')) {
          consoleErrors.push(text.slice(0, 120))
        }
      }
    })
    page.on('pageerror', err => pageErrors.push(err.message.slice(0, 120)))

    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: TIMEOUT })

      // Прокручиваем к astro-island с Playground (нужно для client:visible IntersectionObserver)
      try {
        const island = await page.$('astro-island[component-url*="Playground"]')
        if (island) {
          await island.scrollIntoViewIfNeeded()
          await page.waitForTimeout(500) // небольшая пауза после скролла
        }
      } catch {}
      await page.waitForTimeout(3000) // ждём Sandpack

      // Есть ли wrapper
      const hasWrapper = await page.$('.sp-wrapper') !== null

      // Есть ли error overlay внутри Sandpack
      const sandpackErrors = await page.$$eval(
        '.sp-overlay, [class*="sp-error"], [class*="error-overlay"]',
        els => els.map(el => el.textContent?.trim().slice(0, 100)).filter(Boolean)
      )

      // Есть ли preview iframe
      const hasPreview = await page.$('.sp-preview-iframe') !== null

      if (!hasWrapper) {
        p.errors = [...(p.errors || []), 'Playground: .sp-wrapper not found (not rendered)']
      } else if (!hasPreview) {
        p.errors = [...(p.errors || []), 'Playground: preview iframe missing']
      } else if (sandpackErrors.length > 0) {
        p.errors = [...(p.errors || []), `Playground error: ${sandpackErrors[0]}`]
      }

      if (consoleErrors.length > 0) {
        p.warnings = [...(p.warnings || []), `Console: ${consoleErrors[0]}`]
      }
      if (pageErrors.length > 0) {
        p.errors = [...(p.errors || []), `JS error: ${pageErrors[0]}`]
      }

      const status = p.errors?.length ? '❌' : '✅'
      console.log(`  ${status} ${p.section}/${p.file}${p.errors?.length ? ' — ' + p.errors[0] : ''}`)

    } catch (err) {
      p.errors = [...(p.errors || []), `Playwright: ${err.message.slice(0, 80)}`]
      console.log(`  ❌ ${p.section}/${p.file} — ${err.message.slice(0, 60)}`)
    }

    await page.close()
  }

  await browser.close()
  return pages
}

async function main() {
  console.log(`🔍 Яша Learn Code Auditor`)
  console.log(`🌐 Base URL: ${BASE_URL}`)
  if (SECTIONS) console.log(`📂 Sections: ${SECTIONS.join(', ')}`)

  const pages = getPages()
  console.log(`📄 Total pages: ${pages.length} (${pages.filter(p => p.hasPlayground).length} with Playground)`)

  // Фаза 1
  let results = await checkHttp(pages)

  // Фаза 2
  results = await checkPlaygrounds(results)

  // Финальная статистика
  const failed = results.filter(r => r.errors?.length > 0)
  const warned = results.filter(r => !r.errors?.length && r.warnings?.length > 0)
  const passed = results.filter(r => !r.errors?.length && !r.warnings?.length)

  const summary = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    sections: SECTIONS || 'all',
    total: results.length,
    passed: passed.length,
    warned: warned.length,
    failed: failed.length,
    playgroundsChecked: results.filter(r => r.hasPlayground).length,
    failures: failed.map(r => ({ url: r.url, file: `${r.section}/${r.file}`, errors: r.errors })),
    warnings: warned.map(r => ({ url: r.url, file: `${r.section}/${r.file}`, warnings: r.warnings })),
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2))

  console.log(`\n📊 Summary:`)
  console.log(`  ✅ Passed:   ${passed.length}`)
  console.log(`  ⚠  Warnings: ${warned.length}`)
  console.log(`  ❌ Failed:   ${failed.length}`)
  console.log(`  📄 Report:   ${OUTPUT_FILE}`)

  if (failed.length > 0) {
    console.log(`\n❌ Failed pages:`)
    for (const f of failed) {
      console.log(`  ${f.file}: ${f.errors.join(' | ')}`)
    }
  }

  // Вывести JSON summary для Dashboard (воркер читает stdout)
  console.log('\n--- DASHBOARD_SUMMARY ---')
  console.log(JSON.stringify(summary))

  process.exit(failed.length > 0 ? 1 : 0)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
