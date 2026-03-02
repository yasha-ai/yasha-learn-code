import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { visit } from 'unist-util-visit'

const require2 = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The absolute path that @theguild/remark-mermaid injects into MDX imports
const MERMAID_ORIGINAL_PATH = require2.resolve('@theguild/remark-mermaid/mermaid')

// Our custom component that forces black text for all node fills
const MERMAID_CUSTOM_PATH = path.resolve(__dirname, '../components/CustomMermaid.tsx')

/**
 * Remark plugin that runs after remarkMermaid and rewrites the auto-injected
 * import to point to our custom Mermaid component (with black text).
 */
export function remarkMermaidTextFix() {
  return (ast) => {
    visit(ast, 'mdxjsEsm', (node) => {
      const body = node.data?.estree?.body ?? []
      for (const declaration of body) {
        if (
          declaration.type === 'ImportDeclaration' &&
          declaration.source?.value === MERMAID_ORIGINAL_PATH
        ) {
          declaration.source.value = MERMAID_CUSTOM_PATH
          if (declaration.source.raw) {
            declaration.source.raw = JSON.stringify(MERMAID_CUSTOM_PATH)
          }
        }
      }
    })
  }
}
