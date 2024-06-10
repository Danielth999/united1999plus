"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "./spinner/Spinner";
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data);

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
  const { toast } = useToast();

  const { data: category, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
    fetcher
  );

  if (error) {
    toast({
      title: "เกิดข้อผิดพลาด",
      description: error.message,
      status: "error",
      variant: "destructive",
    });
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="font-bold text-2xl text-black">เกิดข้อผิดพลาดในการดึงข้อมูล</h1>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!Array.isArray(category)) {
    return (
      <div className="text-center mt-10">
        <h1 className="font-bold text-2xl text-black">ไม่มีหมวดหมู่ที่จะแสดง</h1>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 md:mt-5 text-center">
        <h1 className="font-bold text-2xl text-black">ผลิตภัณฑ์ของเรา</h1>
      </div>
      <div className="md:mt-5">
        {/* Carousel for small screens */}
        <div className="block sm:hidden mx-auto w-full max-w-md">
          <Slider {...settings}>
            {category.map((cateItem) => (
              <div key={cateItem.categoryId} className="p-4">
                <div className="bg-[#f1f0ed] p-6 text-center rounded-md font-medium shadow-lg hover:shadow-2xl transition-all ease-in-out duration-300">
                  <Link
                    href={`/category/${cateItem.nameSlug}`}
                    className="font-bold"
                  >
                    <Image
                      src={cateItem.cateImg}
                      alt={cateItem.name}
                      width={100}
                      height={100}
                      className="object-contain mx-auto mb-4"
                    />
                    <div>{cateItem.name}</div>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        {/* Grid for medium and larger screens */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {category.map((item) => (
              <div
                key={item.categoryId}
                className="bg-[#f1f0ed] p-6 text-center rounded-md font-medium hover:shadow-2xl transition-all ease-in-out duration-300"
              >
                <Link
                  href={`/category/${item.nameSlug}`}
                  className="font-bold flex flex-col items-center"
                >
                  <Image
                    src={item.cateImg}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="object-contain mb-4"
                  />
                  <div>{item.name}</div>
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
