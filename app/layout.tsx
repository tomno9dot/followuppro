import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"

export const metadata: Metadata = {
  metadataBase: new URL("https://followuppro.vercel.app"),

  title: {
    default: "FollowUpPro – AI Follow-Up System for Service Businesses",
    template: "%s | FollowUpPro"
  },

  description:
    "FollowUpPro helps freelancers, agencies, and service businesses never forget client follow-ups. Get reminders and generate AI-powered follow-up emails instantly.",

  keywords: [
    "AI follow up tool",
    "follow up reminder software",
    "freelancer CRM",
    "proposal follow up email generator",
    "client follow up system",
    "service business CRM"
  ],

  authors: [{ name: "FollowUpPro Team" }],

  openGraph: {
    title: "FollowUpPro – Stop Losing Clients",
    description:
      "Never lose a deal because you forgot to follow up. Get reminders and AI-powered follow-up emails instantly.",
    url: "https://followuppro.vercel.app",
    siteName: "FollowUpPro",
    images: [
      {
        url: "/og-image.png", // optional image later
        width: 1200,
        height: 630,
        alt: "FollowUpPro AI Follow-Up System"
      }
    ],
    locale: "en_US",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "FollowUpPro – AI Follow-Up System",
    description:
      "Never forget to follow up again. AI-powered follow-up reminders for service businesses."
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
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}