// components/skeleton/CategorySkeleton.jsx
import React from "react";

const CategorySkeleton = () => {
  return (
    <div className="flex justify-center space-x-4">
      <div className="w-64 h-48 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="w-64 h-48 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="w-64 h-48 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  );
};

export default CategorySkeleton;
