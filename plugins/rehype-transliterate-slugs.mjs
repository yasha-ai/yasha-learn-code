/**
 * rehype-transliterate-slugs
 * 
 * Replaces Cyrillic (Russian) heading anchor IDs with transliterated Latin equivalents.
 * Runs after rehype-slug so the IDs are already set.
 * Also updates any <a> href="#anchor" links in the same document.
 */

import { visit } from 'unist-util-visit'

// Cyrillic to Latin transliteration table (BGN/PCGN Russian standard)
const TRANSLIT_MAP = {
  'а': 'a',  'б': 'b',  'в': 'v',  'г': 'g',  'д': 'd',
  'е': 'e',  'ё': 'yo', 'ж': 'zh', 'з': 'z',  'и': 'i',
  'й': 'j',  'к': 'k',  'л': 'l',  'м': 'm',  'н': 'n',
  'о': 'o',  'п': 'p',  'р': 'r',  'с': 's',  'т': 't',
  'у': 'u',  'ф': 'f',  'х': 'kh', 'ц': 'ts', 'ч': 'ch',
  'ш': 'sh', 'щ': 'shch','ъ': '',  'ы': 'y',  'ь': '',
  'э': 'e',  'ю': 'yu', 'я': 'ya',
  // Uppercase
  'А': 'a',  'Б': 'b',  'В': 'v',  'Г': 'g',  'Д': 'd',
  'Е': 'e',  'Ё': 'yo', 'Ж': 'zh', 'З': 'z',  'И': 'i',
  'Й': 'j',  'К': 'k',  'Л': 'l',  'М': 'm',  'Н': 'n',
  'О': 'o',  'П': 'p',  'Р': 'r',  'С': 's',  'Т': 't',
  'У': 'u',  'Ф': 'f',  'Х': 'kh', 'Ц': 'ts', 'Ч': 'ch',
  'Ш': 'sh', 'Щ': 'shch','Ъ': '', 'Ы': 'y',  'Ь': '',
  'Э': 'e',  'Ю': 'yu', 'Я': 'ya',
}

/**
 * Transliterate a string: Cyrillic chars → Latin, rest kept as-is
 */
function transliterate(str) {
  return str
    .split('')
    .map(char => TRANSLIT_MAP[char] !== undefined ? TRANSLIT_MAP[char] : char)
    .join('')
}

/**
 * Check if string contains Cyrillic characters
 */
function hasCyrillic(str) {
  return /[а-яёА-ЯЁ]/.test(str)
}

/**
 * The rehype plugin
 */
export default function rehypeTransliterateSlugs() {
  return (tree) => {
    // Collect ID replacements: { oldId → newId }
    const idMap = {}

    // Pass 1: Find heading elements with Cyrillic IDs and compute new IDs
    visit(tree, 'element', (node) => {
      const tag = node.tagName
      if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) return

      const props = node.properties || {}
      const id = props.id
      if (!id || !hasCyrillic(id)) return

      const newId = transliterate(id)
      idMap[id] = newId
      node.properties.id = newId
    })

    if (Object.keys(idMap).length === 0) return

    // Pass 2: Update any <a href="#old-id"> links in the document
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return

      const href = node.properties?.href
      if (!href || !href.startsWith('#')) return

      const oldId = href.slice(1) // remove leading #
      if (idMap[oldId]) {
        node.properties.href = '#' + idMap[oldId]
      }
    })
  }
}
