"use client";
import React from "react";
import Link from "next/link";
import Head from "next/head";
import { Phone, Mail, MapPin } from "lucide-react";

const Header = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UNITED 1999 PLUS",
    url: "https://united1999plus.vercel.app",
    logo: "https://united1999plus.vercel.app/logo/logo-real-no-bg.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+66-38-623-126",
      contactType: "Customer Service",
      areaServed: "TH",
      availableLanguage: ["Thai"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "1 ซ.ข้างอำเภอ ถ.ตากสินมหาราช ต.เชิงเนิน อ.เมือง",
      addressLocality: "ระยอง",
      postalCode: "21000",
      addressCountry: "TH",
    },
  };

  return (
    <>
      <Head>
        <title>UNITED 1999 PLUS - ติดต่อเรา</title>
        <meta name="description" content="ติดต่อ UNITED 1999 PLUS ผ่านทางโทรศัพท์ อีเมล หรือแผนที่" />
        <meta name="keywords" content="UNITED 1999 PLUS, ติดต่อเรา, โทรศัพท์, อีเมล, แผนที่" />
        <meta property="og:title" content="UNITED 1999 PLUS - ติดต่อเรา" />
        <meta property="og:description" content="ติดต่อ UNITED 1999 PLUS ผ่านทางโทรศัพท์ อีเมล หรือแผนที่" />
        <meta property="og:url" content="https://united1999plus.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UNITED 1999 PLUS - ติดต่อเรา" />
        <meta name="twitter:description" content="ติดต่อ UNITED 1999 PLUS ผ่านทางโทรศัพท์ อีเมล หรือแผนที่" />
        <meta name="twitter:image" content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      {/* Header section */}
      <header id="header" className="bg-gray-100 p-2 md:p-4 hidden md:flex">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-end">
          <ul className="w-full md:w-auto flex flex-col md:flex-row items-center justify-end space-y-2 md:space-y-0 md:space-x-4">
            <li className="flex items-center space-x-2">
              <Phone className="text-[#204d9c]" />
              <Link href="tel:038-623-126" passHref>
                <span className="text-[#204d9c] font-bold">038-623-126</span>
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="text-[#204d9c]" />
              <a
                href="mailto:united.sale.ry@gmail.com"
                className="text-[#204d9c] font-bold"
              >
                united.sale.ry@gmail.com
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="text-[#204d9c]" />
              <Link
                href="https://maps.app.goo.gl/3Csiyy9qcEXeckLM8"
                passHref
                target="_blank"
              >
                <span className="text-[#204d9c] font-bold">
                  บริษัท ยูไนเต็ด1999 พลัซ จำกัด
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </header>
      {/* End header */}
    </>
  );
};

export default Header;
