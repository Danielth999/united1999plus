"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import useSWR from "swr";
import Spinner from "@/components/spinner/Spinner";
import { useSession } from "next-auth/react";
import ModalEditProduct from "./EditProduct"; // นำเข้า ModalEditProduct จากตำแหน่งที่ถูกต้อง

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ProductDetail = ({ productId }) => {
  const { data: product, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 4000,
    }
  );
  const [openEditModal, setOpenEditModal] = useState(false);
  const { data: session, status } = useSession();

  const handleProductUpdated = (updatedProduct) => {
    // Handle the updated product (e.g., re-fetch product data or update state)
  };

  if (error) return <p>Error loading product: {error.message}</p>;

  if (!product)
    return (
      <div className="grid place-items-center">
        <Spinner />
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <div className="bg-gray-300 rounded-lg border">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="responsive"
              width={500}
              height={500}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="lg:hover:scale-150 lg:hover:translate-x-1/2 transition-transform duration-200 ease-out rounded-md"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {product.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {product.description}
            </p>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                จำนวนในสต็อก:
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                {product.stock}
              </span>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                สี:
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                {product.color}
              </span>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                ขนาด:
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                {product.size}
              </span>
            </div>
          </div>
          <div className="mt-auto">
            <button className="bg-gray-200 border-none focus:text-white text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 w-full">
              เพิ่มลงในรายการที่สนใจ
            </button>
            {session && session.user.role === "admin" && (
              <>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2 w-full"
                  onClick={() => setOpenEditModal(true)}
                >
                  แก้ไขสินค้า
                </button>
                <ModalEditProduct
                  product={product}
                  onProductUpdated={handleProductUpdated}
                  open={openEditModal}
                  setOpen={setOpenEditModal}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
