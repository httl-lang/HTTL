import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Banner } from 'nextra/components'

import 'nextra-theme-docs/style.css'
import { HttlHead } from '@/components/head'
import { HttlAnalytics } from '@/components/analytics'

export const metadata = {

}

const navbar = (
  <Navbar
    logoLink="/"
    logo={
      <img
        alt="HTTL"
        src="/logo-full.svg"
        style={{ height: '1rem' }}
      />
    }
    projectLink="https://github.com/httl-lang/HTTL"
  />
)
const footer = <Footer>MIT License {new Date().getFullYear()} © HTTL.</Footer>

export default async function RootLayout({ children }: any) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <HttlHead />
      </Head>
      <body>
        <Banner storageKey="0.1.1-release">
          <a href="/docs/release-notes#2025-02-25">
            🎉 HTTL 0.1.1 is released, Read more →
          </a>
        </Banner>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap('/docs')}
          docsRepositoryBase="https://github.com/httl-lang/HTTL/tree/main/packages/httl-website"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
      <HttlAnalytics />
    </html>
  )
}