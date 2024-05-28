import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";

const Dropdown = () => {
  const [categories, setCategories] = useState([]);
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [openSubDropdownId, setOpenSubDropdownId] = useState(null);
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
        setOpenSubDropdownId(null);
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

  const toggleSubDropdown = (categoryId) => {
    if (openSubDropdownId === categoryId) {
      setOpenSubDropdownId(null);
    } else {
      setOpenSubDropdownId(categoryId);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
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
              <li key={category.categoryId} className="relative">
                <button
                  onClick={() => toggleSubDropdown(category.categoryId)}
                  className="flex justify-between w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                >
                  {category.name}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
                {openSubDropdownId === category.categoryId && (
                  <ul className="absolute left-full top-0 ml-2 w-52 bg-white shadow-lg rounded-md z-20">
                    {category.subcategories.map((subcategory) => (
                      <li
                        key={subcategory.subcategoryId}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        <Link href={`category/${subcategory.nameSlug}`}>
                          {subcategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
