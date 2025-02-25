import { compileMdx } from 'nextra/compile'
import { MDXRemote } from 'nextra/mdx-remote'

export async function MdxRenderer({ content }: { content: string }) {
  const code = await compileMdx(content)

  return <MDXRemote compiledSource={code} components={{}} />
}
