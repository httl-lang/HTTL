import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { HttlHead } from '@/components/head'

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
const footer = <Footer>HTTL License {new Date().getFullYear()} © HTTL.</Footer>

export default async function RootLayout({ children }: any) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning    >
      <Head>
        <HttlHead />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap('/docs')}
          docsRepositoryBase="https://github.com/httl-lang/HTTL/tree/main/packages/httl-website"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}