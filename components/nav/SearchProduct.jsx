import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchProduct = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form
      className="hidden md:flex md:mx-4 items-center h-[70px] flex-1 justify-center"
      onSubmit={handleSearch}
    >
      <input
        type="search"
        name="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md border outline-none rounded-l-md p-2"
        placeholder="ค้นหาชื่อสิ้นค้าหรือเลขรหัส SKU"
      />
      <button
        type="submit"
        className="bg-red-500 p-2 flex justify-center items-center rounded-r-md"
      >
        <Search className="text-white" />
      </button>
    </form>
  );
};

export default SearchProduct;
