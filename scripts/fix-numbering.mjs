/**
 * Re-number all lessons based on sidebar.order.
 * Each directory level is numbered independently.
 */
import fs from 'fs'
import path from 'path'

const docsDir = 'src/content/docs'
let fixed = 0

function renumberDir(dir) {
  const files = []

  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f)
    if (fs.statSync(full).isDirectory()) {
      // Recursively number subdirectories independently
      renumberDir(full)
      continue
    }
    if (!full.endsWith('.mdx')) continue

    const content = fs.readFileSync(full, 'utf-8')
    const titleMatch = content.match(/^title:\s*["'](.+?)["']/m)
    if (!titleMatch) continue

    const title = titleMatch[1]
    const isIndex = f === 'index.mdx'

    const orderMatch = content.match(/^\s*order:\s*(\d+)/m)
    const order = orderMatch ? parseInt(orderMatch[1]) : 999

    files.push({ path: full, title, isIndex, order, rawTitle: titleMatch[0] })
  }

  files.sort((a, b) => a.order - b.order)

  let num = 1
  for (const file of files) {
    if (file.isIndex) continue

    const cleanTitle = file.title.replace(/^\d+\.\s*/, '')
    const newTitle = `${num}. ${cleanTitle}`

    if (newTitle !== file.title) {
      let content = fs.readFileSync(file.path, 'utf-8')
      content = content.replace(file.rawTitle, `title: "${newTitle}"`)
      fs.writeFileSync(file.path, content)
      fixed++
    }

    num++
  }
}

const sections = fs.readdirSync(docsDir).filter(f => fs.statSync(path.join(docsDir, f)).isDirectory())
for (const section of sections) {
  renumberDir(path.join(docsDir, section))
}

console.log(`Re-numbered ${fixed} lessons`)
