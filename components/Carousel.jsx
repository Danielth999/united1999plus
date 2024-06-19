"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useSWR from "swr";
import axios from "axios";
import CarouselSkeleton from "./skeleton/CarouselSkeleton";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
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
};

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
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
      <ChevronLeft color="black" size={32} />
    </div>
  );
};

const Carousel = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/carousel/filter`,
    fetcher
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  if (error) {
    return <div>Error loading images</div>;
  }

  if (!data) {
    return (
      <div className="flex justify-center ">
        <CarouselSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto rounded-lg overflow-hidden p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <Slider {...settings}>
        {data.map((image, index) => (
          <div
            key={index}
            className="relative w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px]"
          >
            <Image
              src={image.url}
              alt={`Slide ${index + 1}`}
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
              className="rounded-lg w-auto h-full"
            />
          </div>
        ))}
      </Slider>
      <style jsx global>{`
        .slick-prev:before,
        .slick-next:before {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default Carousel;
