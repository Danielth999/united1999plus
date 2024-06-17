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
  keywords: ['united1999plus', 'UNITED 1999 PLUS', 'บริษัท ยูไนเต็ด1999 พลัซ จำกัด','ยูไนเต็ด1999พลัซ'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={prompt.className}>
        <SessionProvider>
          <Suspense>{children}</Suspense>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
