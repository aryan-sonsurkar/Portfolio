import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MODCODES District — Aryan Sonsurkar",
  description:
    "An interactive world built by a builder. Not a portfolio. A district.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&family=Fira+Code:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
