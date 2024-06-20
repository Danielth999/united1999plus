"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useToast } from "@/components/ui/use-toast";
import useSWR from "swr";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useMemo, useCallback } from "react";
import CategorySkeleton from "@/components/skeleton/CategorySkeleton";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const CustomNextArrow = memo(({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "none",
        right: "10px",
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <ChevronRight color="black" size={32} />
    </div>
  );
});

const CustomPrevArrow = memo(({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "none",
        left: "10px",
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <ChevronLeft color="black" size={20} />
    </div>
  );
});

const Category = () => {
  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      nextArrow: <CustomNextArrow />,
      prevArrow: <CustomPrevArrow />,
    }),
    []
  );
  const { toast } = useToast();

  const { data: category, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Deduping interval of 1 minute
    }
  );

  const renderCategory = useCallback(
    (item) => (
      <div
        key={item.categoryId}
        className="bg-[#f1f0ed] p-6 text-center rounded-md font-medium hover:shadow-2xl transition-all ease-in-out duration-300"
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

  const skeletonCount = category?.length || 1; // จำนวน skeleton ตามความยาวของ category

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
        {/* Carousel for small screens */}
        <div className="block sm:hidden mx-auto w-full max-w-md">
          <Slider {...settings}>
            {category.map((cateItem) => (
              <div key={cateItem.categoryId} className="p-4">
                {renderCategory(cateItem)}
              </div>
            ))}
          </Slider>
        </div>
        {/* Grid for medium and larger screens */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {category.map(renderCategory)}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .slick-prev:before,
        .slick-next:before {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default Category;
