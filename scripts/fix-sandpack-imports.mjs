/**
 * Add Sandpack import to MDX files that use <Sandpack> but don't import it.
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
    if (!/<Sandpack[\s/>]/.test(content)) continue
    if (content.includes("@codesandbox/sandpack-react")) continue

    // Add Sandpack import after frontmatter
    const importLine = "import { Sandpack } from '@codesandbox/sandpack-react'"
    if (content.startsWith('---')) {
      const end = content.indexOf('---', 3)
      if (end !== -1) {
        const insertPos = end + 3
        content = content.slice(0, insertPos) + '\n' + importLine + '\n' + content.slice(insertPos)
      }
    } else {
      content = importLine + '\n\n' + content
    }

    fs.writeFileSync(full, content)
    fixed++
  }
}

processDir(DOCS_DIR)
console.log(`✅ Added Sandpack imports to ${fixed} files`)
