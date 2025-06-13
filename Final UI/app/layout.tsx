import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { Inter, Lora, Abhaya_Libre } from "next/font/google"
import "./globals.css"
import HeaderWrapper from "@/components/header-wrapper"

const inter = Inter({ subsets: ["latin"] })
const lora = Lora({ 
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"]
})
const abhayaLibre = Abhaya_Libre({ 
  subsets: ["latin"],
  variable: "--font-abhaya-libre",
  weight: ["400", "500", "600", "700", "800"]
})

export const metadata: Metadata = {
  title: "100 Networks",
  description: "Follow employers and find your dream job",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} ${lora.variable} ${abhayaLibre.variable}`}>
        <div className="flex flex-col h-screen overflow-hidden bg-background">
          <HeaderWrapper />
          <main className="flex-1 overflow-auto px-4 py-3">{children}</main>
          </div>
      </body>
    </html>
  )
}
