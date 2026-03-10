import fs from 'fs'
import path from 'path'

const docsDir = 'src/content/docs'
const sections = fs.readdirSync(docsDir).filter(f => fs.statSync(path.join(docsDir, f)).isDirectory())
let total = 0

for (const section of sections) {
  const files = []
  function scan(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f)
      if (fs.statSync(full).isDirectory()) { scan(full); continue }
      if (!full.endsWith('.mdx')) continue
      const content = fs.readFileSync(full, 'utf-8')
      const match = content.match(/^title:\s*"(.+)"/m)
      if (!match) continue
      const title = match[1]
      const hasNumber = /^\d+\./.test(title)
      const isIndex = f === 'index.mdx'
      if (!hasNumber && !isIndex) {
        files.push({ file: path.relative(docsDir, full), title })
      }
    }
  }
  scan(path.join(docsDir, section))
  if (files.length > 0) {
    console.log(`--- ${section} (${files.length} без номера) ---`)
    for (const f of files) console.log(`  ${f.title}`)
    total += files.length
  }
}
console.log(`\nВсего без нумерации: ${total}`)
