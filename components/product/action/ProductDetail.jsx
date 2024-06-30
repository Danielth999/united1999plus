"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr"; // เพิ่มการนำเข้า useSWRConfig
import { useSession } from "next-auth/react";
import Head from "next/head";
import ModalEditProduct from "./EditProduct";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SkeletonScreen from "@/components/skeleton/Skeleton";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ProductDetail = ({ productId, open, setOpen }) => {
  const { data: product, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { mutate } = useSWRConfig(); // ใช้ useSWRConfig เพื่อดึง mutate
  const [openEditModal, setOpenEditModal] = useState(false);
  const { data: session, status } = useSession();

  // เพิ่มฟังก์ชัน handleProductUpdated
  const handleProductUpdated = (updatedProduct) => {
    // ทำการอัปเดตข้อมูลผลิตภัณฑ์ใน state
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, updatedProduct, false);
    setOpenEditModal(false);
  };

  if (error) return <p>Error loading product: {error.message}</p>;

  const structuredData = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.imageUrl,
        description: product.description,
        sku: product.sku,
        brand: {
          "@type": "Brand",
          name: "UNITED 1999 PLUS",
        },
        offers: {
          "@type": "Offer",
          url: `https://united1999plus.vercel.app/product/${productId}`,
          priceCurrency: "THB",
          price: product.price,
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      <Head>
        <title>
          {product ? product.name : "Loading..."} - UNITED 1999 PLUS
        </title>
        <meta
          name="description"
          content={product ? product.description : "Loading..."}
        />
        <meta
          name="keywords"
          content={`ผลิตภัณฑ์, UNITED 1999 PLUS, ${
            product ? product.name : ""
          }`}
        />
        <meta
          property="og:title"
          content={product ? product.name : "Loading..."}
        />
        <meta
          property="og:description"
          content={product ? product.description : "Loading..."}
        />
        <meta property="og:image" content={product ? product.imageUrl : ""} />
        <meta
          property="og:url"
          content={`https://united1999plus.vercel.app/product/${productId}`}
        />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={product ? product.name : "Loading..."}
        />
        <meta
          name="twitter:description"
          content={product ? product.description : "Loading..."}
        />
        <meta name="twitter:image" content={product ? product.imageUrl : ""} />
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
      </Head>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto p-4 max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดสินค้า</DialogTitle>
          </DialogHeader>
          {product ? (
            <div className="container mx-auto p-4 max-w-3xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <div className="bg-gray-300 rounded-lg border">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={500}
                      height={500}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        width: "100%",
                        height: "auto",
                      }}
                      className="transition-transform duration-200 ease-out rounded-md hover:scale-110 w-auto h-auto"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {product.name}
                    </h2>
                    <p
                      className="text-gray-600 dark:text-gray-300 text-sm mb-4 max-h-20 overflow-y-auto"
                      dangerouslySetInnerHTML={{
                        __html: product.description.replace(/\n/g, "<br />"),
                      }}
                    ></p>
                    <div className="mb-4 ">
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        จำนวน: {""}
                      </span>
                      <p
                        className="text-gray-600 dark:text-gray-300"
                        dangerouslySetInnerHTML={{
                          __html: product.stock.replace(/\n/g, "<br />"),
                        }}
                      ></p>
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
          ) : (
            <>
              <div className="flex justify-center">
                <SkeletonScreen />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductDetail;