import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../mdx-components'
import { notFound } from 'next/navigation'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: { params: Promise<{ mdxPath?: string[] }> }) {
  const params = await props.params
  try {
    const { metadata } = await importPage(params.mdxPath)
    return metadata
  } catch {
    return {}
  }
}

const Wrapper = useMDXComponents().wrapper

export default async function Page(props: {
  params: Promise<{ mdxPath?: string[] }>
}) {
  const params = await props.params
  let page: Awaited<ReturnType<typeof importPage>>
  try {
    page = await importPage(params.mdxPath)
  } catch {
    notFound()
  }
  const { default: MDXContent, ...pageProps } = page
  return (
    <Wrapper {...pageProps}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
