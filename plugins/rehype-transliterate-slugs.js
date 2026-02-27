/**
 * rehype-transliterate-slugs (CommonJS)
 *
 * Replaces Cyrillic (Russian) heading anchor IDs with transliterated Latin equivalents.
 * Runs after rehype-slug so the IDs are already set.
 * Also updates any <a href="#anchor"> links in the same document.
 */

// Cyrillic to Latin transliteration table (BGN/PCGN Russian standard)
const TRANSLIT_MAP = {
  'а': 'a',   'б': 'b',  'в': 'v',  'г': 'g',   'д': 'd',
  'е': 'e',   'ё': 'yo', 'ж': 'zh', 'з': 'z',   'и': 'i',
  'й': 'j',   'к': 'k',  'л': 'l',  'м': 'm',   'н': 'n',
  'о': 'o',   'п': 'p',  'р': 'r',  'с': 's',   'т': 't',
  'у': 'u',   'ф': 'f',  'х': 'kh', 'ц': 'ts',  'ч': 'ch',
  'ш': 'sh',  'щ': 'shch','ъ': '',  'ы': 'y',   'ь': '',
  'э': 'e',   'ю': 'yu', 'я': 'ya',
  'А': 'a',   'Б': 'b',  'В': 'v',  'Г': 'g',   'Д': 'd',
  'Е': 'e',   'Ё': 'yo', 'Ж': 'zh', 'З': 'z',   'И': 'i',
  'Й': 'j',   'К': 'k',  'Л': 'l',  'М': 'm',   'Н': 'n',
  'О': 'o',   'П': 'p',  'Р': 'r',  'С': 's',   'Т': 't',
  'У': 'u',   'Ф': 'f',  'Х': 'kh', 'Ц': 'ts',  'Ч': 'ch',
  'Ш': 'sh',  'Щ': 'shch','Ъ': '', 'Ы': 'y',   'Ь': '',
  'Э': 'e',   'Ю': 'yu', 'Я': 'ya',
}

function transliterate(str) {
  return str
    .split('')
    .map(char => TRANSLIT_MAP[char] !== undefined ? TRANSLIT_MAP[char] : char)
    .join('')
}

function hasCyrillic(str) {
  return /[\u0400-\u04FF]/.test(str)
}

function visit(node, type, visitor) {
  if (node && node.type === type) visitor(node)
  if (node && node.children) {
    for (const child of node.children) {
      visit(child, type, visitor)
    }
  }
}

function rehypeTransliterateSlugs() {
  return (tree) => {
    const idMap = {}

    // Pass 1: find heading elements with Cyrillic IDs
    visit(tree, 'element', (node) => {
      const tag = node.tagName
      if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) return

      const id = node.properties && node.properties.id
      if (!id || !hasCyrillic(id)) return

      const newId = transliterate(id)
      idMap[id] = newId
      node.properties.id = newId
    })

    if (Object.keys(idMap).length === 0) return

    // Pass 2: update <a href="#old-id"> anchor links
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return
      const href = node.properties && node.properties.href
      if (!href || !href.startsWith('#')) return

      const oldId = href.slice(1)
      if (idMap[oldId]) {
        node.properties.href = '#' + idMap[oldId]
      }
    })
  }
}

module.exports = rehypeTransliterateSlugs
