"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  Users,
  Package,
  Tag,
  SquareArrowOutDownLeft,
  GalleryHorizontal,
} from "lucide-react";

const Sidebar = ({ isExpanded }) => {
  const pathname = usePathname();

  return (
    <div
      className={`flex ${
        isExpanded ? "w-64" : "w-0"
      } bg-gray-800 text-white min-h-screen flex-col transition-width duration-300`}
    >
      <div className="p-4">
        <Link href="/">
          <span className="text-2xl text-center align-middle   font-bold">
            United 1999 Plus
          </span>
        </Link>
      </div>
      <nav className="mt-4 flex-grow">
        <Link href="/admin-dashboard/dashboard">
          <div
            className={`flex  items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              isExpanded &&  pathname === "/admin-dashboard/dashboard" ? "bg-blue-500" : ""
            }`}
          >
            <Home className="mr-3" />
            {isExpanded && <span className="text-xl">แดชบอร์ด</span>}
          </div>
        </Link>
        <Link href="/admin-dashboard/carousel">
          <div
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              isExpanded &&  pathname === "/admin-dashboard/carousel" ? "bg-blue-500" : ""
            }`}
          >
            <GalleryHorizontal className="mr-3" />
            {isExpanded && <span className="text-xl">แบนเนอร์</span>}
          </div>
        </Link>
        <Link href="/admin-dashboard/users">
          <div
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              isExpanded &&  pathname === "/admin-dashboard/users" ? "bg-blue-500" : ""
            }`}
          >
            <Users className="mr-3" />
            {isExpanded && <span className="text-xl">ผู้ใช้</span>}
          </div>
        </Link>
        <Link href="/admin-dashboard/products">
          <div
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              isExpanded &&  pathname === "/admin-dashboard/products" ? "bg-blue-500" : ""
            }`}
          >
            <Package className="mr-3" />
            {isExpanded && <span className="text-xl">สินค้า</span>}
          </div>
        </Link>
        <Link href="/admin-dashboard/category">
          <div
            className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              isExpanded &&  pathname === "/admin-dashboard/category" ? "bg-blue-500" : ""
            }`}
          >
            <Tag className="mr-3" />
            {isExpanded && <span className="text-xl">หมวดหมู่</span>}
          </div>
        </Link>
        {/* signout */}
        <div
          className="flex items-center py-2.5 px-4 text-red-500 rounded transition duration-200 hover:bg-gray-700 cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <SquareArrowOutDownLeft className="mr-3" />
          {isExpanded && <span className="text-xl">ออกจากระบบ</span>}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
