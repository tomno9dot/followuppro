import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),

  title: {
    default:
      "FollowUpPro — Revenue Recovery System for Consultants",
    template: "%s | FollowUpPro"
  },

  description:
    "FollowUpPro helps consultants recover lost $5K+ deals by tracking follow-ups, monitoring revenue at risk, and generating AI-powered follow-up emails.",

  keywords: [
    "consultant CRM",
    "AI follow-up tool",
    "revenue recovery system",
    "pipeline management for consultants",
    "freelance consultant CRM",
    "close more deals"
  ],

  authors: [{ name: "FollowUpPro" }],

  openGraph: {
    title:
      "FollowUpPro — Close More $5K+ Deals With Consistent Follow-Ups",
    description:
      "Track revenue at risk, improve follow-up consistency, and increase your close rate.",
    url: "https://yourdomain.com",
    siteName: "FollowUpPro",
    images: [
      {
        url: "/og-image.png", // optional image file in public/
        width: 1200,
        height: 630,
        alt: "FollowUpPro Revenue Dashboard"
      }
    ],
    locale: "en_US",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title:
      "FollowUpPro — Revenue Recovery System for Consultants",
    description:
      "Recover lost revenue and improve follow-up consistency with AI.",
  },

  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}