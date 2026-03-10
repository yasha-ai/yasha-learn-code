/**
 * Add number prefixes to lesson titles based on sidebar.order.
 * Only affects lessons that don't already have a number prefix.
 */
import fs from 'fs'
import path from 'path'

const docsDir = 'src/content/docs'
const sections = fs.readdirSync(docsDir).filter(f => fs.statSync(path.join(docsDir, f)).isDirectory())
let fixed = 0

for (const section of sections) {
  // Collect all MDX files in this section (including subdirectories)
  const files = []

  function scan(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f)
      if (fs.statSync(full).isDirectory()) { scan(full); continue }
      if (!full.endsWith('.mdx')) continue

      const content = fs.readFileSync(full, 'utf-8')
      const titleMatch = content.match(/^title:\s*"(.+)"/m)
      if (!titleMatch) continue

      const title = titleMatch[1]
      const isIndex = f === 'index.mdx'
      const hasNumber = /^\d+\./.test(title)

      // Extract sidebar order
      const orderMatch = content.match(/^\s*order:\s*(\d+)/m)
      const order = orderMatch ? parseInt(orderMatch[1]) : 999

      files.push({ path: full, title, isIndex, hasNumber, order })
    }
  }

  scan(path.join(docsDir, section))

  // Sort by sidebar order
  files.sort((a, b) => a.order - b.order)

  // Add numbering to files that don't have it (skip index files)
  for (const file of files) {
    if (file.isIndex || file.hasNumber) continue

    // The number is order + 1 (order is 0-based)
    const num = file.order + 1
    const newTitle = `${num}. ${file.title}`

    let content = fs.readFileSync(file.path, 'utf-8')
    content = content.replace(
      `title: "${file.title}"`,
      `title: "${newTitle}"`
    )
    fs.writeFileSync(file.path, content)
    fixed++
  }
}

console.log(`Added numbering to ${fixed} lessons`)
