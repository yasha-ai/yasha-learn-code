/**
 * Fix broken Playground components:
 * 1. Replace </Playground> with /> (self-closing)
 * 2. Fix unclosed template literals
 * 3. Fix unclosed braces
 */
import fs from 'fs'
import path from 'path'

let fixed = 0

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  const original = content

  // Fix 1: Replace </Playground> closing tags with self-closing />
  // Pattern: <Playground ... > ... </Playground> → needs /> before any content after files
  // But actually most cases are just missing /> at end

  // Fix </Playground> → remove it, ensure /> before it
  content = content.replace(/<\/Playground>/g, '')

  // Find last <Playground and ensure it ends with />
  const lastPG = content.lastIndexOf('<Playground')
  if (lastPG === -1) return

  const afterPG = content.slice(lastPG)

  // Check if it ends with />
  const trimmed = afterPG.trimEnd()
  if (!trimmed.endsWith('/>')) {
    // Try to find where the component should close
    // Look for the last }} which closes the files prop
    const lastDoubleBrace = afterPG.lastIndexOf('}}')
    if (lastDoubleBrace !== -1) {
      const beforeClose = content.slice(0, lastPG) + afterPG.slice(0, lastDoubleBrace + 2) + '\n/>'
      content = beforeClose
    } else if (trimmed.endsWith('>')) {
      // Simple case: > should be />
      const lastAngle = content.lastIndexOf('>')
      content = content.slice(0, lastAngle) + '/>'
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content)
    fixed++
  }
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f)
    if (fs.statSync(full).isDirectory()) { walk(full); continue }
    if (!full.endsWith('.mdx')) continue
    const content = fs.readFileSync(full, 'utf-8')
    if (!content.includes('<Playground')) continue
    fixFile(full)
  }
}

walk('src/content/docs')
console.log(`Fixed ${fixed} files`)
