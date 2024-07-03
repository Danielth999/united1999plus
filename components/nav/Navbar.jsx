"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import logo from '@/public/logo/logo.png';
import { useSession, signOut } from "next-auth/react";
import {  Menu, X, LayoutGrid } from "lucide-react";
import Header from "./Header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchProduct from "./SearchProduct";
import useSWR from "swr";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  const { data: categories, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
    fetcher
  );
  const { data: session, status } = useSession();

  if (error) {
    toast({
      title: "เกิดข้อผิดพลาด",
      description: error.message,
      status: "error",
      variant: "destructive",
    });
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="font-bold text-2xl text-black">
            เกิดข้อผิดพลาดในการดึงข้อมูล
          </h1>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "UNITED 1999 PLUS",
    url: "https://united1999plus.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://united1999plus.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Head>
        <title>UNITED 1999 PLUS - หมวดหมู่สินค้า</title>
        <meta name="description" content="เลือกดูหมวดหมู่สินค้าต่างๆ ของเรา" />
        <meta
          name="keywords"
          content="หมวดหมู่สินค้า, UNITED 1999 PLUS, บรรจุภัณฑ์เฟสท์, อุปกรณ์สำนักงาน, ผลิตภัณฑ์ทำความสะอาด"
        />
        <meta property="og:title" content="UNITED 1999 PLUS - หมวดหมู่สินค้า" />
        <meta
          property="og:description"
          content="เลือกดูหมวดหมู่สินค้าต่างๆ ของเรา"
        />
        <meta property="og:url" content="https://united1999plus.vercel.app" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="UNITED 1999 PLUS - หมวดหมู่สินค้า"
        />
        <meta
          name="twitter:description"
          content="เลือกดูหมวดหมู่สินค้าต่างๆ ของเรา"
        />
        <meta
          name="twitter:image"
          content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Header />
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between h-[80px] px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <div className="flex md:hidden items-center">
              <button
                id="menu"
                aria-label="menu"
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-[#204d9c] border-none focus:outline-none"
              >
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
            <Link href="/" passHref>
              <Image
                src={logo}
                width="0"
                height="0"
                sizes="100vw"
                alt="logo"
                className="w-[50px] h-auto"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-[#204d9c] flex items-center font-semibold">
                    หมวดหมู่ <LayoutGrid className="ml-2" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories?.map((items) => (
                    <DropdownMenuItem key={items.categoryId}>
                      <Link
                        href={`/category/${items.nameSlug}`}
                        passHref
                        className="flex justify-between w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                      >
                        {items.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem>
                    <Link
                      href="/products"
                      passHref
                      className="flex justify-between w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                    >
                      สินค้าทั้งหมด
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <SearchProduct className="hidden md:flex" />
          {status === "authenticated" && session ? (
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer space-x-2 bg-[#dee4f0] rounded-full px-2 py-1">
                    <div className="w-8 h-8 bg-blue-700 text-white flex items-center justify-center rounded-full">
                      {session.user.username[0].toUpperCase()}
                    </div>
                    <div className="text-[#204d9c] font-medium overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[100px]">
                      {session.user.username}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {session.user.role === "admin" && (
                    <DropdownMenuItem>
                      <Link href="/admin-dashboard/dashboard" passHref>
                        ระบบจัดการ
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <button onClick={() => signOut()} className="text-red-500">
                      ออกจากระบบ
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" passHref>
                <span className="text-[#204d9c]  font-bold">เข้าสู่ระบบ</span>
              </Link>
              <Link href="/register" passHref>
                <span className="bg-[#204d9c] text-white py-2 px-4 rounded-full font-bold">
                  สมัครสมาชิก
                </span>
              </Link>
            </div>
          )}
        </div>

        {menuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <SearchProduct className="flex mb-4" />
              <Header className="flex flex-col items-start space-y-2 mb-4" />
              <div className="text-[#204d9c] font-bold px-3 py-2">หมวดหมู่</div>
              {categories?.map((category) => (
                <Link
                  href={`category/${category.nameSlug}`}
                  key={category.categoryId}
                  passHref
                >
                  <span className="block px-3 py-2 rounded-md text-base font-medium text-[#204d9c] hover:bg-gray-100">
                    {category.name}
                  </span>
                </Link>
              ))}
              <span className="block px-3 py-2 rounded-md text-base font-medium text-[#204d9c] hover:bg-gray-100">
                <Link href="/products" passHref>
                  สินค้าทั้งหมด
                </Link>
              </span>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
