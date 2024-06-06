"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

const importAll = (r) => r.keys().map(r);

const images = importAll(
  require.context("../public/banner", false, /\.(png|jpe?g|svg)$/)
);

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full mx-auto rounded-lg overflow-hidden p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px]"
          >
            <Image
              src={image.default.src}
              alt={`Slide ${index + 1}`}
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
