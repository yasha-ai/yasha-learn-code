/**
 * Migration script: Nextra → Astro Starlight
 *
 * 1. Reads _meta.json files to get section/page titles
 * 2. Adds frontmatter (title) to each MDX file
 * 3. Copies files to src/content/docs/
 * 4. Generates sidebar config for astro.config.mjs
 */

import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const CONTENT_SRC = path.join(ROOT, 'content')
const CONTENT_DEST = path.join(ROOT, 'src', 'content', 'docs')

// Ensure destination exists
fs.mkdirSync(CONTENT_DEST, { recursive: true })

const sidebarSections = []
let totalFiles = 0
let skippedFiles = 0

// Get all section directories
const sections = fs.readdirSync(CONTENT_SRC).filter(item => {
  const fullPath = path.join(CONTENT_SRC, item)
  return fs.statSync(fullPath).isDirectory()
})

// Read root _meta.json for section labels
let rootMeta = {}
const rootMetaPath = path.join(CONTENT_SRC, '_meta.json')
if (fs.existsSync(rootMetaPath)) {
  rootMeta = JSON.parse(fs.readFileSync(rootMetaPath, 'utf-8'))
}

// Process root index.mdx if exists
const rootIndex = path.join(CONTENT_SRC, 'index.mdx')
if (fs.existsSync(rootIndex)) {
  processFile(rootIndex, CONTENT_DEST, 'Главная')
}

// Process each section
for (const section of sections) {
  const sectionPath = path.join(CONTENT_SRC, section)
  const metaPath = path.join(sectionPath, '_meta.json')

  // Read section _meta.json
  let meta = {}
  if (fs.existsSync(metaPath)) {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
  }

  const sectionLabel = rootMeta[section] || section
  const destSection = path.join(CONTENT_DEST, section)
  fs.mkdirSync(destSection, { recursive: true })

  // Collect items for sidebar
  const sidebarItems = []

  // Get all MDX/MD files in section (including subdirs)
  const files = getAllMdxFiles(sectionPath)

  for (const filePath of files) {
    const relativePath = path.relative(sectionPath, filePath)
    const slug = relativePath.replace(/\.(mdx|md)$/, '').replace(/\\/g, '/')
    const baseName = slug.split('/').pop()

    // Get title from _meta.json or extract from file
    let title = meta[baseName] || null

    // Handle subdirectory _meta.json
    const subDir = path.dirname(relativePath)
    if (subDir !== '.') {
      const subMetaPath = path.join(sectionPath, subDir, '_meta.json')
      if (fs.existsSync(subMetaPath)) {
        const subMeta = JSON.parse(fs.readFileSync(subMetaPath, 'utf-8'))
        title = subMeta[baseName] || title
      }
    }

    const destDir = path.join(destSection, path.dirname(relativePath))
    fs.mkdirSync(destDir, { recursive: true })

    processFile(filePath, destDir, title)
  }

  // Generate sidebar entry using autogenerate
  sidebarSections.push({
    label: sectionLabel,
    autogenerate: { directory: section },
  })
}

// Write sidebar config snippet
const sidebarConfig = JSON.stringify(sidebarSections, null, 2)
const sidebarPath = path.join(ROOT, 'scripts', 'sidebar-generated.json')
fs.writeFileSync(sidebarPath, sidebarConfig)

console.log(`\n✅ Migration complete!`)
console.log(`   Files processed: ${totalFiles}`)
console.log(`   Files skipped (already have frontmatter): ${skippedFiles}`)
console.log(`   Sidebar config: ${sidebarPath}`)

// ---

function getAllMdxFiles(dir) {
  const results = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    if (item === '_meta.json') continue
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      results.push(...getAllMdxFiles(fullPath))
    } else if (/\.(mdx|md)$/.test(item)) {
      results.push(fullPath)
    }
  }

  return results
}

function processFile(filePath, destDir, metaTitle) {
  let content = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath)

  // Check if already has frontmatter
  if (content.startsWith('---')) {
    // Already has frontmatter - just copy
    const destPath = path.join(destDir, fileName)
    fs.writeFileSync(destPath, content)
    skippedFiles++
    totalFiles++
    return
  }

  // Extract title from first H1 or use meta title
  let title = metaTitle
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (!title && h1Match) {
    title = h1Match[1].trim()
  }
  if (!title) {
    title = path.basename(filePath, path.extname(filePath))
  }

  // Clean title for YAML (escape quotes)
  const safeTitle = title.replace(/"/g, '\\"')

  // Remove first H1 since Starlight renders the frontmatter title as H1
  if (h1Match) {
    content = content.replace(/^#\s+.+\n+/m, '')
  }

  // Fix internal links: /section/page → /section/page/
  // Starlight uses trailing slashes by default
  content = content.replace(/\]\(\/([\w/-]+)\)/g, '](/$1/)')

  // Build frontmatter
  const frontmatter = `---\ntitle: "${safeTitle}"\n---\n\n`

  const finalContent = frontmatter + content
  const destPath = path.join(destDir, fileName)
  fs.writeFileSync(destPath, finalContent)
  totalFiles++
}
