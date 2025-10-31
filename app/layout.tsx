import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { DataProvider } from "@/lib/data-context"
import { Nav } from "@/components/nav"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FounderHQ - Tech Expense Dashboard",
  description: "Track and optimize your tech infrastructure costs",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <DataProvider>
          <Nav />
          <main className="min-h-screen">{children}</main>
        </DataProvider>
        <Analytics />
      </body>
    </html>
  )
}
