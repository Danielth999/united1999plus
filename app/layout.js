import { Prompt } from "next/font/google";
import "./globals.css";
import SessionProvider from "../components/SessionProvider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import Head from "next/head";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "UNITED 1999 PLUS",
  description: "UNITED 1999 PLUS",
  keywords: ['united1999plus', 'UNITED 1999 PLUS', 'บริษัท ยูไนเต็ด1999 พลัซ จำกัด', 'ยูไนเต็ด1999พลัซ'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://united1999plus.vercel.app/" />
        <meta property="og:image" content="/path/to/image.jpg" />
        <meta property="og:site_name" content="UNITED 1999 PLUS" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="/path/to/image.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "UNITED 1999 PLUS",
              "url": "https://united1999plus.vercel.app/",
              "logo": "/path/to/logo.jpg",
              "sameAs": [
                "https://web.facebook.com/unitedry/?locale=th_TH&_rdc=1&_rdr"
              ]
            }
          `}
        </script>
      </Head>
      <body className={prompt.className}>
        <SessionProvider>
          <Suspense>{children}</Suspense>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
