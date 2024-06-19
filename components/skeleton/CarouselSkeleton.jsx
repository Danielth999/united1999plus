import React from "react";
import { Image } from "lucide-react";
const CarouselSkeleton = () => {
  return (
    <div
      role="status"
      className="flex items-center justify-center h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px] w-full bg-gray-100 rounded-lg animate-pulse dark:bg-gray-700"
    >
      <Image className="  text-gray-300  " />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default CarouselSkeleton;
