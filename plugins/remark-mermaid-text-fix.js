/**
 * remark-mermaid-text-fix (CommonJS)
 *
 * Runs after @theguild/remark-mermaid and rewrites its auto-injected import
 * to point to our custom Mermaid component that forces black text on all nodes.
 *
 * Background: remarkMermaid resolves the component to an absolute path and
 * hard-codes it as the import source in the MDX AST, so webpack aliases don't work.
 * This plugin intercepts the AST and swaps the path before bundling.
 */

const path = require('path')

// Absolute path that @theguild/remark-mermaid injects (resolved from its own location)
const MERMAID_ORIGINAL_PATH = require.resolve('@theguild/remark-mermaid/mermaid')

// Our custom component that forces primaryTextColor: '#000000'
const MERMAID_CUSTOM_PATH = path.resolve(__dirname, '../components/CustomMermaid.tsx')

function remarkMermaidTextFix() {
  return function (ast) {
    if (!Array.isArray(ast.children)) return

    for (const node of ast.children) {
      if (node.type !== 'mdxjsEsm') continue

      const body = node.data?.estree?.body ?? []
      for (const declaration of body) {
        if (
          declaration.type === 'ImportDeclaration' &&
          declaration.source?.value === MERMAID_ORIGINAL_PATH
        ) {
          declaration.source.value = MERMAID_CUSTOM_PATH
          if (declaration.source.raw != null) {
            declaration.source.raw = JSON.stringify(MERMAID_CUSTOM_PATH)
          }
        }
      }
    }
  }
}

module.exports = remarkMermaidTextFix
