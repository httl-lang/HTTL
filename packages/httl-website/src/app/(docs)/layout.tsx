import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {

}

const navbar = (
  <Navbar
    logoLink="/"
    logo={
      <img
        alt="HTTL"
        src="./logo-full.svg"
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/httl-lang/HTTL/tree/main/packages/httl-website"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}