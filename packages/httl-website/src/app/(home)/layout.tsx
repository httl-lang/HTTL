import type { Metadata } from "next";

import "./globals.css";
import { HttlHead } from "@/components/head";

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
        {children}
      </body>
    </html>
  );
}
