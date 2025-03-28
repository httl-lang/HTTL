import type { Metadata } from "next";

import "./globals.css";
import { HttlHead } from "@/components/head";
import { HttlAnalytics } from "@/components/analytics";
import { Nav } from "@/components/nav";

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'VS Code', href: '/vscode' },
  { name: 'CLI', href: 'https://www.npmjs.com/package/httl-cli' },

  { name: 'Docs', href: '/docs', right: true },
]

export const metadata: Metadata = {
  title: "HTTL Website",
  description: "HTTL programming language - Official website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <HttlHead />
      </head>
      <body>
        <div>
          <Nav navigation={navigation} />
          {children}
        </div>
      </body>
      <HttlAnalytics />
    </html>
  );
}
