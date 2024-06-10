"use client";
import React from "react";
import Link from "next/link";
import { LayoutGrid, ChevronRight } from "lucide-react";
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
  const { data: categories, error } = useSWR('/api/category', fetcher);

  if (error) {
    return <div>Failed to load categories</div>;
  }

  if (!categories) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger >
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
