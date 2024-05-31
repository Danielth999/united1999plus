"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo/logo-real-no-bg.png";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Search, Menu, X, LayoutGrid } from "lucide-react";
import Header from "./Header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cate, setCate] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/category`);
      setCate(res.data);
    } catch (error) {
      console.log("error is", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <>
      <Header />
      <nav className="bg-white shadow-md ">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between h-[80px] px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <div className="flex md:hidden items-center">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#204d9c]">
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
            <Link href="/">
              <Image src={logo} width={50} height={50} alt="logo" className="w-auto h-auto" />
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-[#204d9c] flex items-center font-semibold">
                    หมวดหมู่ <LayoutGrid className="ml-2" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {cate.map((category) => (
                    <DropdownMenuItem key={category.categoryId}>
                      <Link href={`category/${category.nameSlug}`}>
                        <span className="flex justify-between w-full px-4 py-2 text-left text-black hover:bg-gray-100">
                          {category.name}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="hidden md:flex md:mx-4 items-center h-[70px] flex-1 justify-center">
            <input
              type="search"
              className="w-full max-w-md border outline-none rounded-l-md p-2"
              placeholder="ค้นหาชื่อสิ้นค้าหรือเลขรหัส SKU"
            />
            <button className="bg-red-500 p-2 flex justify-center items-center rounded-r-md">
              <Search className="text-white" />
            </button>
          </div>

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
                  <DropdownMenuItem>
                    <Link href="/#">ข้อมูลส่วนตัว</Link>
                  </DropdownMenuItem>
                  {session.user.role === "admin" && (
                    <DropdownMenuItem>
                      <Link href="/admin-dashboard/dashboard">ระบบจัดการ</Link>
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
              <Link href="/login">
                <span className="text-[#204d9c] font-bold">Login</span>
              </Link>
              <Link href="/register">
                <span className="bg-[#204d9c] text-white py-2 px-4 rounded-lg font-bold">Register</span>
              </Link>
            </div>
          )}
        </div>

        {menuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="px-4 py-2">
                <form className="flex">
                  <input
                    type="search"
                    className="w-full border outline-none rounded-md p-2"
                    placeholder="ค้นหาชื่อสิ้นค้าหรือเลขรหัส SKU"
                  />
                  <button className="bg-red-500 p-2 flex justify-center items-center rounded-r-md">
                    <Search className="text-white" />
                  </button>
                </form>
              </div>
              <div className="text-[#204d9c] font-bold px-3 py-2">หมวดหมู่</div>
              {cate.map((category) => (
                <Link href={`category/${category.nameSlug}`} key={category.categoryId}>
                  <span className="block px-3 py-2 rounded-md text-base font-medium text-[#204d9c] hover:bg-gray-100">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
