"use client";
import React, { useState, Suspense } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/spinner/Spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import PaginationComponent from "@/components/Pagination";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ProductList = ({ searchQuery, setResultsCount }) => {
  const { data, error } = useSWR(
    `/api/products${searchQuery ? `?search=${searchQuery}` : ""}`,
    fetcher
  );
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  if (!data) {
    return (
      <div className="grid place-items-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const products = data;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  // ตั้งค่าจำนวนผลลัพธ์การค้นหา
  setResultsCount(products.length);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
        {currentProducts.map((item) => (
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
                {item.Category?.name || "Unknown"}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

const ProductPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [resultsCount, setResultsCount] = useState(0);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-5">
        <div className="mt-2">
          <small>
            {" "}
            <Link href="/" className="hover:underline">
              หน้าหลัก
            </Link>{" "}
            /{" "}
            <Link href="/" className="hover:underline">
              สินค้าทั้งหมด
            </Link>
          </small>
        </div>
        <div className="mt-2">
          <h1 className="text-3xl">
            {searchQuery ? (
              <>
                ผลการค้นหา{" "}
                <span className="text-red-500">
                  '{searchQuery}' ({resultsCount})
                </span>
              </>
            ) : (
              <>
              สินค้าทั้งหมด <span className="text-red-500">({resultsCount})</span>
              </>
            )}
          </h1>
        </div>
        <Suspense fallback={<Spinner />}>
          <ProductList
            searchQuery={searchQuery}
            setResultsCount={setResultsCount}
          />
        </Suspense>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
