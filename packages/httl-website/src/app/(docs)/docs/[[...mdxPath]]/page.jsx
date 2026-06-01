import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../../../mdx-components'
import { DocsRedirect } from './docs-redirect'

// The bare /docs path has no index page; send it to the first doc. In production
// Cloudflare's _redirects handles this, but next dev (and the optional catch-all)
// still resolve /docs to this route with an empty mdxPath, so redirect here too.
const DOCS_LANDING = '/docs/introduction/about-httl'

const generateDocParams = generateStaticParamsFor('mdxPath')

// Include the bare /docs path so `output: export` knows the route exists; the
// Page below redirects it to the landing doc.
export async function generateStaticParams() {
  const params = await generateDocParams()
  return [{ mdxPath: [] }, ...params]
}

export async function generateMetadata(props) {
  const params = await props.params
  if (!params.mdxPath?.length) {
    return {}
  }
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

const Wrapper = useMDXComponents().wrapper

export default async function Page(props) {
  const params = await props.params
  if (!params.mdxPath?.length) {
    return <DocsRedirect to={DOCS_LANDING} />
  }
  const result = await importPage(params.mdxPath)
  const { default: MDXContent, toc, metadata } = result
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
