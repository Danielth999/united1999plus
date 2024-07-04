"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import useSWR from "swr";
import { memo, useMemo, useCallback } from "react";
import CategorySkeleton from "@/components/skeleton/CategorySkeleton";

// ฟังก์ชันสำหรับดึงข้อมูลจาก API
const fetcher = (url) => axios.get(url).then((res) => res.data);

const Category = () => {
  // กำหนดค่าตั้งต้นสำหรับ Swiper
  const swiperOptions = useMemo(
    () => ({
      modules: [Pagination, Autoplay],
      spaceBetween: 50,
      slidesPerView: 1,
      pagination: { clickable: true },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
    }),
    []
  );
  

  // ดึงข้อมูลหมวดหมู่จาก API
  const { data: category, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // ตั้งเวลา dedupe 1 นาที
    }
  );

  // ฟังก์ชันสำหรับแสดงผลแต่ละหมวดหมู่
  const renderCategory = useCallback(
    (item) => (
      <div
        key={item.categoryId}
        className="bg-[#f1f0ed] p-6 text-center rounded-md font-medium lg:hover:shadow-2xl transition-all ease-in-out duration-300"
        style={{ willChange: "transform" }}
      >
        <Link
          href={`/category/${item.nameSlug}`}
          className="font-bold flex flex-col items-center"
        >
          <Image
            src={item.cateImg}
            alt={item.name}
            width="0"
            height="0"
            sizes="100vw"
            className="object-contain w-[100px] h-auto mb-4"
            loading="lazy"
          />
          <div>{item.name}</div>
        </Link>
      </div>
    ),
    []
  );

  // แสดงข้อความเมื่อเกิดข้อผิดพลาด
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
          <h1 className="font-bold text-2xl text-black">
            เกิดข้อผิดพลาดในการดึงข้อมูล
          </h1>
        </div>
      </div>
    );
  }

  const skeletonCount = category?.length || 1;

  // แสดง skeleton ขณะโหลดข้อมูล
  if (!category) {
    return (
      <>
        <div className="mt-10 md:mt-5 text-center">
          <h1 className="font-bold text-2xl text-black">ผลิตภัณฑ์ของเรา</h1>
        </div>
        <div className="flex justify-center items-center h-screen">
          <CategorySkeleton count={skeletonCount} />
        </div>
      </>
    );
  }

  // แสดงข้อความเมื่อไม่มีหมวดหมู่
  if (!Array.isArray(category)) {
    return (
      <div className="text-center mt-10">
        <h1 className="font-bold text-2xl text-black">
          ไม่มีหมวดหมู่ที่จะแสดง
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 md:mt-5 text-center">
        <h1 className="font-bold text-2xl text-black">ผลิตภัณฑ์ของเรา</h1>
      </div>
      {!category && (
        <div className="flex justify-center items-center">
          <CategorySkeleton count={skeletonCount} />
        </div>
      )}
      <div className="md:mt-5">
        {/* Swiper สำหรับหน้าจอขนาดเล็ก */}
        <div className="block sm:hidden mx-auto w-full max-w-md">
          <Swiper {...swiperOptions}>
            {category.map((cateItem) => (
              <SwiperSlide key={cateItem.categoryId}>
                <div className="p-4">
                  {renderCategory(cateItem)}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Grid สำหรับหน้าจอขนาดกลางและใหญ่ */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {category.map(renderCategory)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
