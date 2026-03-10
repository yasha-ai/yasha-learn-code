/**
 * Add correct imports to MDX files that use <Playground> or <Sandpack> components.
 */
import fs from 'fs'
import path from 'path'

const DOCS_DIR = path.join(process.cwd(), 'src', 'content', 'docs')

let playgroundCount = 0
let sandpackCount = 0

function processDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item)
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath)
      continue
    }
    if (!/\.(mdx)$/.test(item)) continue

    let content = fs.readFileSync(fullPath, 'utf-8')
    const hasPlayground = /<Playground[\s/>]/.test(content)
    const hasSandpack = /<Sandpack[\s/>]/.test(content)

    if (!hasPlayground && !hasSandpack) continue

    // Already has correct import? Skip.
    if (content.includes("@components/Playground")) continue
    if (content.includes("@codesandbox/sandpack-react") && !hasPlayground) continue

    // Build imports to add after frontmatter
    const imports = []
    if (hasPlayground) {
      imports.push("import { Playground } from '@components/Playground'")
      playgroundCount++
    }
    if (hasSandpack && !hasPlayground) {
      // Only import Sandpack directly if Playground isn't used (Playground already wraps Sandpack)
      imports.push("import { Sandpack } from '@codesandbox/sandpack-react'")
      sandpackCount++
    }

    if (imports.length === 0) continue

    // Insert after frontmatter
    const importBlock = imports.join('\n')
    if (content.startsWith('---')) {
      // Has frontmatter - insert after closing ---
      const endOfFrontmatter = content.indexOf('---', 3)
      if (endOfFrontmatter !== -1) {
        const insertPos = endOfFrontmatter + 3
        content = content.slice(0, insertPos) + '\n' + importBlock + '\n' + content.slice(insertPos)
      }
    } else {
      // No frontmatter - add at top
      content = importBlock + '\n\n' + content
    }

    fs.writeFileSync(fullPath, content)
  }
}

processDir(DOCS_DIR)
console.log(`✅ Added Playground imports to ${playgroundCount} files`)
console.log(`✅ Added Sandpack imports to ${sandpackCount} files`)
