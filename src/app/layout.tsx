import type { Metadata } from "next"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "ARYAN OS | Aryan Sonsurkar",
  description:
    "ARYAN OS — AI Engineering Portfolio by Aryan Sonsurkar. Founder of Fixly. AI Engineer. Full-Stack Developer.",
  keywords: ["Aryan Sonsurkar", "AI Engineer", "Fixly", "Kokanam", "Full-Stack Developer", "Portfolio"],
  openGraph: {
    title: "ARYAN OS | Aryan Sonsurkar",
    description: "AI Engineering Portfolio",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
