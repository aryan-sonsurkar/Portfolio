import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Aryan OS | Aryan Sonsurkar",
  description:
    "Full-Stack Developer, Founder of Fixly, AI Engineer. Building web applications, AI-powered tools, and real-world software products.",
  openGraph: {
    title: "Aryan OS | Aryan Sonsurkar",
    description:
      "Full-Stack Developer, Founder of Fixly, AI Engineer. Building web applications, AI-powered tools, and real-world software products.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
