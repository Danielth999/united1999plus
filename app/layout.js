import { Prompt } from "next/font/google";
import "./globals.css";
import SessionProvider from "../components/SessionProvider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "UNITED 1999 PLUS",
  description: "UNITED 1999 PLUS",
  keywords: [
    "united1999plus",
    "UNITED 1999 PLUS",
    "บริษัท ยูไนเต็ด1999 พลัซ จำกัด",
    "ยูไนเต็ด1999พลัซ",
  ],
  author: "UNITED 1999 PLUS",
  charset: "UTF-8",
  robots: "index, follow",
  ogTitle: "UNITED 1999 PLUS",
  ogDescription: "UNITED 1999 PLUS",
  ogType: "website",
  ogUrl: "https://united1999plus.vercel.app",
};

/** @type {import('next').Viewport} */
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="google-site-verification"
          content="lgf74pzOKh0EhgWQ6MQl0cgd8mfs4uN66G0mizGbO6A"
        />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta name="author" content={metadata.author} />
        <meta charSet={metadata.charset} />
        <meta name="robots" content={metadata.robots} />
        <meta property="og:title" content={metadata.ogTitle} />
        <meta property="og:description" content={metadata.ogDescription} />
        <meta property="og:type" content={metadata.ogType} />
        <meta property="og:url" content={metadata.ogUrl} />

        <title>{metadata.title}</title>
      </head>
      <body className={prompt.className}>
        <SessionProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
