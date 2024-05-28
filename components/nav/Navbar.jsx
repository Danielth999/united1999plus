"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo/logo-real-no-bg.png";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  Search,
  LayoutGrid,
  Phone,
  Mail,
  MapPin,
  CircleUser,
  Menu,
  X,
  KeyRound,
  UserRound,
} from "lucide-react";

import Header from "./Header";
import Dropdown from "./Dropdown";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cate, setCate] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  // console.log(session);

  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`
      );
      setCate(res.data);
    } catch (error) {
      console.log("error is", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []); // กำหนด dependencies เป็นค่าว่าง

  return (
    <>
      <Header />
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between h-[80px] px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-[#204d9c]"
              >
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
            <Link href="/">
              <Image
                src={logo}
                width={50}
                height={50}
                alt="logo"
                className="w-auto h-auto"
              />
            </Link>
            <Dropdown />
          </div>

          <div className="hidden md:flex items-center h-[70px] flex-1 justify-center">
            <input
              type="search"
              className="w-full max-w-md border outline-none rounded-l-md p-2"
              placeholder="ค้นหาชื่อสิ้นค้าหรือเลขรหัส SKU"
            />
            <button className="bg-red-500 p-2 flex justify-center items-center rounded-r-md">
              <Search className="text-white" />
            </button>
          </div>

          {/* Authentication for desktop */}
          {status === "authenticated" && session ? (
            <div className="flex items-center space-x-4">
              <div className="dropdown  dropdown-hover">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn bg-[#dee4f0] flex items-center m-1 rounded-full text-[#204d9c] w-28"
                >
                  <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-md">
                    {session.user.username}
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link href={"/#"}>ข้อมูลส่วนตัว</Link>
                  </li>
                  <li>
                    <Link href={"/admin-dashboard/dashboard"}>ระบบจัดการ</Link>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut()}
                      className=" text-red-500 btn-sm"
                    >
                      ออกจากระบบ
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <span className="text-[#204d9c] font-bold">Login</span>
              </Link>
              <Link href="/register">
                <span className="bg-[#204d9c] text-white py-2 px-4 rounded-lg font-bold">
                  Register
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Search Input */}
              <div className="md:hidden  px-4 py-2">
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

              <Link href="/login">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-[#204d9c] hover:bg-gray-100">
                  เข้าสู่ระบบ
                </span>
              </Link>
              <Link href="/register">
                <span className="space-x-2 flex px-3 py-2 rounded-md text-base font-medium text-[#204d9c] hover:bg-gray-100">
                  สมัครสมาชิก
                </span>
              </Link>

              <Link href="/about">
                <span className="block px-3 py-2 rounded-md text-base font-medium text-[#204d9c] hover:bg-gray-100">
                  เกี่ยวกับเรา
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>
      {/* End navigation */}
    </>
  );
};

export default Navbar;
