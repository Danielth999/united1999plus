"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Category = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const [category, setCategory] = useState([]);

  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/api/category"
      );
      setCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <>
      <div className="mt-10 md:mt-5 text-center">
        <h1 className="font-bold text-black">ผลิตภัณฑ์ของเรา</h1>
      </div>
      <div className="md:mt-5">
        {/* Carousel for small screens */}
        <div className="block sm:hidden mx-auto w-full max-w-md">
          <Slider {...settings}>
            {category.map((cateItem) => (
              <div key={cateItem.categoryId} className="p-4">
                <div className="bg-[#f1f0ed] p-10 text-center rounded-md font-medium hover:shadow-2xl transition-all ease-in-out duration-300">
                  <Link
                    href={`/category/${cateItem.nameSlug}`}
                    className="font-bold"
                  >
                    {cateItem.name}
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        {/* Grid for medium and larger screens */}
        <div className="hidden md:flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 place-content-center gap-4">
            {category.map((item) => (
              <div
                key={item.categoryId}
                className="bg-[#f1f0ed] p-10 text-center rounded-md font-medium hover:shadow-2xl transition-all ease-in-out duration-300"
              >
                <Link href={`/category/${item.nameSlug}`} className="font-bold">
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
