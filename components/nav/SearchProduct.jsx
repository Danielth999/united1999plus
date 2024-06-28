"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchProduct = ({ className }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form
      className={`${className} items-center h-[70px] flex-1 justify-center`}
      onSubmit={handleSearch}
    >
      <div className="relative w-[500px]">
        <input
          type="search"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border outline-none rounded-full p-2 pr-10" // เพิ่ม pr-10 เพื่อให้มีพื้นที่สำหรับไอคอน
          placeholder="ค้นหาชื่อสินค้า"
        />
        <button
          type="submit"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-red-500 p-2 rounded-full"
        >
          <Search className="text-white" />
        </button>
      </div>
    </form>
  );
};

export default SearchProduct;