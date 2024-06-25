"use client";
import React, { useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";
import CarouselSkeleton from "./skeleton/CarouselSkeleton";

const Carousel = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetcher = useMemo(
    () => (url) => axios.get(url).then((res) => res.data),
    []
  );

  const swiperOptions = useCallback(
    () => ({
      modules: [Navigation, Pagination, Autoplay],
      spaceBetween: 50,
      slidesPerView: 1,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: { clickable: true },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
    }),
    []
  );

  const { data, error } = useSWR(
    apiUrl ? `${apiUrl}/api/carousel/filter` : null,
    fetcher
  );

  if (!apiUrl) {
    return <div>Error: API URL is not defined</div>;
  }

  if (error) {
    return <div>Error loading images</div>;
  }

  if (!data) {
    return (
      <div className="flex justify-center">
        <CarouselSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto rounded-lg overflow-hidden p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <Swiper {...swiperOptions()}>
        {data.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px]">
              <Image
                src={image.url}
                alt={`Slide ${index + 1}`}
                fill
                sizes="100%"
                style={{ objectFit: "cover" }}
                className="rounded-lg w-auto h-full"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </Swiper>
      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          background: none;
          color: black;
        }
        .swiper-button-prev::after,
        .swiper-button-next::after {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Carousel;