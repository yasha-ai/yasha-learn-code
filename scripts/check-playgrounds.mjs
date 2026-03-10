import fs from 'fs'
import path from 'path'

const broken = []

function check(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f)
    if (fs.statSync(full).isDirectory()) { check(full); continue }
    if (!full.endsWith('.mdx')) continue
    const content = fs.readFileSync(full, 'utf-8')
    if (!content.includes('<Playground')) continue

    const pgStart = content.lastIndexOf('<Playground')
    const rest = content.slice(pgStart)

    const backticks = (rest.match(/`/g) || []).length
    if (backticks % 2 !== 0) {
      broken.push(full + ' — odd backticks: ' + backticks)
    }

    let braces = 0
    for (const ch of rest) {
      if (ch === '{') braces++
      if (ch === '}') braces--
    }
    if (braces !== 0) {
      broken.push(full + ' — unclosed braces: ' + braces)
    }

    // Check ends with />
    if (!rest.trimEnd().endsWith('/>')) {
      broken.push(full + ' — missing closing />')
    }
  }
}

check('src/content/docs')
console.log('Issues: ' + broken.length)
broken.forEach(b => console.log(b))
