import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0612",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://arssystem.vercel.app"),
  title: "Aryan Rakesh Sonsurkar — Developer, Builder, Creator",
  description:
    "Aryan Sonsurkar is a developer building AI-powered products, shipping real projects, and turning ideas into reality. Explore the MODCODES District — an interactive 3D portfolio experience.",
  keywords: [
    "Aryan Sonsurkar",
    "developer portfolio",
    "full stack developer",
    "AI developer",
    "MODCODES",
    "Next.js developer",
    "Python developer",
    "open source",
    "Mumbai developer",
  ],
  authors: [{ name: "Aryan Sonsurkar" }],
  creator: "Aryan Sonsurkar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arssystem.vercel.app",
    siteName: "Aryan Rakesh Sonsurkar — MODCODES District",
    title: "Aryan Rakesh Sonsurkar — Developer, Builder, Creator",
    description:
      "An interactive world built by a builder. AI-powered products, real projects, and a 3D district to explore.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Aryan Sonsurkar — MODCODES District",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aryan Rakesh Sonsurkar — Developer, Builder, Creator",
    description:
      "An interactive world built by a builder. AI-powered products, real projects, and a 3D district to explore.",
    images: ["/og-image.svg"],
    creator: "@aryan_sonsurkar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aryan Rakesh Sonsurkar",
    url: "https://arssystem.vercel.app",
    jobTitle: "Developer",
    description:
      "Developer building AI-powered products, shipping real projects, and turning ideas into reality.",
    sameAs: [
      "https://github.com/aryan-sonsurkar",
      "https://linkedin.com/in/aryan-sonsurkar",
    ],
    knowsAbout: [
      "Python",
      "TypeScript",
      "Next.js",
      "React",
      "FastAPI",
      "AI/ML",
      "Open Source",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Diploma in Computer Science",
    },
    award: [
      "Best Performing Intern at Kaevron Technologies",
      "SIH-2025 Special Recognition",
    ],
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&family=Fira+Code:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/og-image.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/og-image.svg" />
        <link rel="canonical" href="https://arssystem.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
