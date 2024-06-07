"use client";
import React, { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/spinner/Spinner";
import Pagination from "@/components/Pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const { data, error, isValidating } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000, // อัปเดตข้อมูลทุกๆ 30 วินาที
      dedupingInterval: 60000,
    }
  );

  if (isValidating) {
    return (
      <div className="grid place-items-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error loading products.</div>;
  }

  const products = data?.products || [];
  const totalProducts = data?.totalProducts || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-5">
        <div className="mt-2">
          <small>หน้าหลัก / สินค้าทั้งหมด</small>
        </div>
        <div className="mt-2">
          <h1 className="text-3xl">สินค้าทั้งหมด</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
          {products.map((item) => (
            <Card
              key={item.productId}
              className="hover:shadow-xl border flex flex-col"
            >
              <CardHeader className="border-b">
                <div className="relative w-full h-48 overflow-hidden">
                  <Link href={`/products/${item.productId}`}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      style={{ objectFit: "contain" }}
                      className="max-h-full"
                    />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="line-clamp-2">
                  <Link href={`/products/${item.productId}`}>{item.name}</Link>
                </CardTitle>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <Badge
                  variant="customPrimary"
                  className="font-bold min-w-[40px] text-center"
                >
                  {item.price}฿
                </Badge>
                <Badge
                  variant="customSecondary"
                  className="min-w-[120px] text-center line-clamp-1"
                >
                  {item.Category.name}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-5">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
