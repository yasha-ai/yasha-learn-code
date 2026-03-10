/**
 * Add client:visible directive to React components in MDX files.
 * In Astro, React components need client:* directives to be interactive.
 */
import fs from 'fs'
import path from 'path'

const DOCS_DIR = path.join(process.cwd(), 'src', 'content', 'docs')
let fixed = 0

function processDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item)
    if (fs.statSync(full).isDirectory()) { processDir(full); continue }
    if (!full.endsWith('.mdx')) continue

    let content = fs.readFileSync(full, 'utf-8')
    const original = content

    // Add client:visible to <Playground (but not if already has client:)
    content = content.replace(/<Playground(?!\s+client:)/g, '<Playground client:visible')

    // Add client:visible to <Sandpack (but not if already has client:)
    content = content.replace(/<Sandpack(?!\s+client:)/g, '<Sandpack client:visible')

    if (content !== original) {
      fs.writeFileSync(full, content)
      fixed++
    }
  }
}

processDir(DOCS_DIR)
console.log(`✅ Added client:visible to components in ${fixed} files`)
