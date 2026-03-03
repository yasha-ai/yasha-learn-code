import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Playground } from './components/Playground'
import { Sandpack } from '@codesandbox/sandpack-react'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(
  components: Record<string, React.ComponentType<unknown>> = {}
) {
  return {
    ...docsComponents,
    Playground,
    Sandpack,
    ...components,
  }
}
