import type { Metadata } from "next";

import "./globals.css";

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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
