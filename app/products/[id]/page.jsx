"use client";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import useSWR from "swr";
import Spinner from "@/components/spinner/Spinner";
import Navbar from "@/components/nav/Navbar";
import BreadcrumbComponent from "../components/Breadcrumb"; // นำเข้าจากตำแหน่งที่ถูกต้อง

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ViewProduct = () => {
  const { id } = useParams();
  const { data: product, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    fetcher
  );
  const [openEditModal, setOpenEditModal] = useState(false);

  if (error)
    return (
      <>
        <Navbar />
        <div className="grid place-items-center items-center h-screen">
          <p>Error loading product: {error.message}</p>
        </div>
      </>
    );

  if (!product)
    return (
      <>
        <Navbar />
        <div className="grid place-items-center items-center h-screen">
          <Spinner />
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="container px-5 py-4 mx-auto">
        {product.Category && (
          <BreadcrumbComponent
            category={product.Category}
            productName={product.name}
          />
        )}
        <div className="bg-gray-100 border-2 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative w-full overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700 mb-4 h-[330px] sm:h-[350px] md:h-[410px] lg:h-[490px]">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex mb-4">
                    <div className="mr-4">
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        ราคา:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {product.price} บาท
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        จำนวนในสต็อก:
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      สี:
                    </span>
                    <div className="flex items-center mt-2">
                      <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">
                        {product.color}
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      ขนาด:
                    </span>
                    <div className="flex items-center mt-2">
                      <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">
                        {product.size}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex  mx-2 mb-4">
                  <div className="w-1/2 px-2">
                    <button className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700">
                      เพิ่มลงในตะกร้า
                    </button>
                  </div>
                  <div className="w-1/2 px-2">
                    <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600">
                      เพิ่มลงในสนใจ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
