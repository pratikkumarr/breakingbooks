import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Breaking Books",
    default: "Breaking Books",
  },
  description: "Master CBSE IT (Code 402) and Computer Science for Classes 9-12 with our free, high-quality lessons.",
  icons: {
    icon: "/Logo.png",
    apple: "/Logo.png",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { LoginToastHandler } from "@/components/LoginToastHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Breaking Books",
              "url": "https://breakingbooks.in",
              "logo": "https://breakingbooks.in/Logo.png"
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <NextTopLoader color="var(--accent)" height={2} showSpinner={false} />
        <Suspense fallback={null}>
          <LoginToastHandler />
        </Suspense>
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
