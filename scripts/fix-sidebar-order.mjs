/**
 * Add sidebar.order to MDX frontmatter based on _meta.json order.
 */
import fs from 'fs'
import path from 'path'

const CONTENT_SRC = path.join(process.cwd(), 'content')
const CONTENT_DEST = path.join(process.cwd(), 'src', 'content', 'docs')

let fixed = 0

// Get all section directories
const sections = fs.readdirSync(CONTENT_SRC).filter(item => {
  return fs.statSync(path.join(CONTENT_SRC, item)).isDirectory()
})

for (const section of sections) {
  const metaPath = path.join(CONTENT_SRC, section, '_meta.json')
  if (!fs.existsSync(metaPath)) continue

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
  const keys = Object.keys(meta)

  for (let i = 0; i < keys.length; i++) {
    const slug = keys[i]
    // Try both .mdx and .md
    const mdxPath = path.join(CONTENT_DEST, section, slug + '.mdx')
    const mdPath = path.join(CONTENT_DEST, section, slug + '.md')
    // Also check subdirectory index
    const subIndexPath = path.join(CONTENT_DEST, section, slug, 'index.mdx')

    let filePath = null
    if (fs.existsSync(mdxPath)) filePath = mdxPath
    else if (fs.existsSync(mdPath)) filePath = mdPath
    else if (fs.existsSync(subIndexPath)) filePath = subIndexPath

    if (!filePath) continue

    let content = fs.readFileSync(filePath, 'utf-8')

    // Skip if already has sidebar order
    if (content.includes('sidebar:') && content.includes('order:')) continue

    if (!content.startsWith('---')) continue

    const endOfFrontmatter = content.indexOf('---', 3)
    if (endOfFrontmatter === -1) continue

    const frontmatter = content.slice(3, endOfFrontmatter)
    const rest = content.slice(endOfFrontmatter)

    // Add sidebar order
    const newFrontmatter = frontmatter.trimEnd() + `\nsidebar:\n  order: ${i}\n`
    content = '---' + newFrontmatter + rest

    fs.writeFileSync(filePath, content)
    fixed++
  }

  // Handle subdirectories with their own _meta.json (e.g., react/state-management)
  const subDirs = fs.readdirSync(path.join(CONTENT_SRC, section)).filter(item => {
    return fs.statSync(path.join(CONTENT_SRC, section, item)).isDirectory()
  })

  for (const subDir of subDirs) {
    const subMetaPath = path.join(CONTENT_SRC, section, subDir, '_meta.json')
    if (!fs.existsSync(subMetaPath)) continue

    const subMeta = JSON.parse(fs.readFileSync(subMetaPath, 'utf-8'))
    const subKeys = Object.keys(subMeta)

    for (let i = 0; i < subKeys.length; i++) {
      const slug = subKeys[i]
      const filePath = path.join(CONTENT_DEST, section, subDir, slug + '.mdx')
      if (!fs.existsSync(filePath)) continue

      let content = fs.readFileSync(filePath, 'utf-8')
      if (content.includes('sidebar:') && content.includes('order:')) continue
      if (!content.startsWith('---')) continue

      const endOfFrontmatter = content.indexOf('---', 3)
      if (endOfFrontmatter === -1) continue

      const frontmatter = content.slice(3, endOfFrontmatter)
      const rest = content.slice(endOfFrontmatter)

      const newFrontmatter = frontmatter.trimEnd() + `\nsidebar:\n  order: ${i}\n`
      content = '---' + newFrontmatter + rest

      fs.writeFileSync(filePath, content)
      fixed++
    }
  }
}

console.log(`✅ Added sidebar order to ${fixed} files`)
