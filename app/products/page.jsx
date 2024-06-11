"use client";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (data) {
      setResultsCount(data.length);
    }
  }, [data, setResultsCount]);

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
            <CardFooter className="flex justify-between p-4 bg-gray-100 border-t">
                <div className="flex flex-col items-center">
                  <Badge
                    variant="customPrimary"
                    className="font-bold w-full text-center"
                  >
                    <span>
                      ฿{item.price}/{item.unitType}
                    </span>
                  </Badge>
                </div>
                <div className="flex flex-col items-center">
                  <Badge
                    variant="customSecondary"
                    className="w-full text-center line-clamp-1"
                  >
                    {category.name}
                  </Badge>
                </div>
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
            / สินค้าทั้งหมด
          </small>
        </div>
        <div className="mt-2">
          <h1 className="text-3xl">
            {searchQuery ? (
              <>
                ผลการค้นหา{" "}
                <span className="text-orange-500">
                  '{searchQuery}' ({resultsCount})
                </span>
              </>
            ) : (
              "สินค้าทั้งหมด"
            )}
          </h1>
        </div>
        <ProductList
          searchQuery={searchQuery}
          setResultsCount={setResultsCount}
        />
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
