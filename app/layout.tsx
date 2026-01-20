import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import { GiftBuddyChatbot } from "@/components/gift-buddy-chatbot"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "GIFT CHOICE - Enfolding Your Emotions...",
  description:
    "Discover unique and heartfelt gifts for birthdays, anniversaries, and special moments. Fast delivery and personalized options available.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <GiftBuddyChatbot />
      </body>
    </html>
  )
}
