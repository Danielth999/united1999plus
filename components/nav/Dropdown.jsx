"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { LayoutGrid, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dropdown = () => {
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const result = await axios.get("/api/category");
      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
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
              <Link href={`/category/${category.nameSlug}`}>
                <span className=" w-full   text-black hover:bg-gray-100">
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
