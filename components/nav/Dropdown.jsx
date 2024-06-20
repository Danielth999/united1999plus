"use client";
import React from "react";
import Link from "next/link";
import { LayoutGrid, ChevronRight } from "lucide-react";
import Head from "next/head";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

const Dropdown = () => {
  const { data: categories, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/category`, fetcher);

  if (error) {
    return <div>Failed to load categories</div>;
  }

  if (!categories) {
    return <div>Loading...</div>;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://united1999plus.vercel.app/category/${category.nameSlug}`,
      name: category.name,
    })),
  };

  return (
    <>
      <Head>
        <title>หมวดหมู่สินค้า - UNITED 1999 PLUS</title>
        <meta name="description" content="เลือกดูหมวดหมู่สินค้าต่างๆ ของเรา" />
        <meta name="keywords" content="หมวดหมู่สินค้า, UNITED 1999 PLUS, บรรจุภัณฑ์เฟสท์, อุปกรณ์สำนักงาน, ผลิตภัณฑ์ทำความสะอาด" />
        <meta property="og:title" content="หมวดหมู่สินค้า - UNITED 1999 PLUS" />
        <meta property="og:description" content="เลือกดูหมวดหมู่สินค้าต่างๆ ของเรา" />
        <meta property="og:url" content="https://united1999plus.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="หมวดหมู่สินค้า - UNITED 1999 PLUS" />
        <meta name="twitter:description" content="เลือกดูหมวดหมู่สินค้าต่างๆ ของเรา" />
        <meta name="twitter:image" content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex space-x-2">
            <LayoutGrid className="text-[#204d9c]" /> หมวดหมู่
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-lg">
          {categories.map((category) => (
            <DropdownMenuItem
              className="flex justify-between"
              key={category.categoryId}
            >
              <Link href={`/category/${category.nameSlug}`} passHref>
                <span className="w-full text-black hover:bg-gray-100">
                  {category.name}
                </span>
              </Link>
              <div>
                <ChevronRight />
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Dropdown;
