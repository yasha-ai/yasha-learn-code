/**
 * Remove Playground/Sandpack imports from MDX files.
 * These components will be injected globally via Starlight's component overrides.
 */
import fs from 'fs'
import path from 'path'

const DOCS_DIR = path.join(process.cwd(), 'src', 'content', 'docs')

let fixed = 0

function processDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item)
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath)
      continue
    }
    if (!/\.(mdx|md)$/.test(item)) continue

    let content = fs.readFileSync(fullPath, 'utf-8')
    const original = content

    // Remove Playground imports (various relative paths)
    content = content.replace(/^import\s+\{?\s*Playground\s*\}?\s+from\s+['"].*components\/Playground['"]\s*;?\n?/gm, '')

    // Remove Sandpack imports
    content = content.replace(/^import\s+\{?\s*Sandpack\s*\}?\s+from\s+['"]@codesandbox\/sandpack-react['"]\s*;?\n?/gm, '')

    if (content !== original) {
      fs.writeFileSync(fullPath, content)
      fixed++
    }
  }
}

processDir(DOCS_DIR)
console.log(`✅ Fixed ${fixed} files (removed component imports)`)
