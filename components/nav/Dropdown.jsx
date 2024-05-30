"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";

const Dropdown = () => {
  const [categories, setCategories] = useState([]);
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMainDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleMainDropdown = () => {
    setIsMainDropdownOpen(!isMainDropdownOpen);
  };

  return (
    <div className="relative hidden md:inline-block" ref={dropdownRef}>
      <div className="inline-block">
        <button
          onClick={toggleMainDropdown}
          className="btn btn-ghost text-[#204d9c] font-bold m-1 flex items-center"
        >
          <LayoutGrid className="text-[#204d9c]" /> หมวดหมู่
        </button>
        {isMainDropdownOpen && (
          <ul className="absolute left-0 mt-2 w-52 bg-white shadow-lg rounded-md z-10">
            {categories.map((category) => (
              <li key={category.categoryId}>
                <Link href={`category/${category.nameSlug}`}>
                  <span className="flex justify-between w-full px-4 py-2 text-left text-black hover:bg-gray-100">
                    {category.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
