import fs from 'fs'
import path from 'path'

function check(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item)
    if (fs.statSync(full).isDirectory()) { check(full); continue }
    if (!full.endsWith('.mdx') && !full.endsWith('.md')) continue
    const content = fs.readFileSync(full, 'utf-8')
    if (!content.startsWith('---')) {
      console.log('NO FRONTMATTER:', full)
    } else {
      const end = content.indexOf('---', 3)
      if (end === -1) {
        console.log('BROKEN FRONTMATTER:', full)
      } else {
        const fm = content.slice(3, end).trim()
        if (!fm.includes('title:')) console.log('NO TITLE:', full)
      }
    }
  }
}
check('src/content/docs')
