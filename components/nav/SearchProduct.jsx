import React from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchProduct = () => {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const handleSearch = (e) => {
    e.preventDefault();
    const encodedKeyword = encodeURI(keyword);
    router.push(`/products/search?q=${encodedKeyword}`);
    
  };

  return (
    <form onSubmit={handleSearch} className="hidden md:flex md:mx-4 items-center h-[70px] flex-1 justify-center">
      <input
        type="search"
        name="search"
        className="w-full max-w-md border outline-none rounded-l-md p-2"
        placeholder="ค้นหาชื่อสิ้นค้าหรือเลขรหัส SKU"
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit" className="bg-red-500 p-2 flex justify-center items-center rounded-r-md">
        <Search className="text-white" />
      </button>
    </form>
  );
};

export default SearchProduct;