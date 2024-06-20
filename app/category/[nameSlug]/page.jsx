"use client";

import useSWR from "swr";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Head from "next/head";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/spinner/Spinner";
import PaginationComponent from "@/components/Pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductDetail from "@/components/product/action/ProductDetail"; // ตรวจสอบตำแหน่งให้ถูกต้อง

const fetcher = (url) => axios.get(url).then((res) => res.data);

const CategoryPage = () => {
  const { nameSlug } = useParams();
  const { data: category, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/${nameSlug}`,
    fetcher
  );
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [selectedProductId, setSelectedProductId] = useState(null);

  if (error) {
    return <div>Error fetching category</div>;
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center h-screen mt-10">
        <Spinner />
      </div>
    );
  }

  if (!category.Product || category.Product.length === 0) {
    return <div>No products found in this category</div>;
  }

  // Logic for displaying current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = category.Product.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(category.Product.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: category.Product.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://united1999plus.vercel.app/product/${product.productId}`,
      name: product.name,
    })),
  };

  return (
    <>
      <Head>
        <title>หมวดหมู่: {category.name} - UNITED 1999 PLUS</title>
        <meta
          name="description"
          content={`เลือกดูสินค้าหมวดหมู่ ${category.name} จาก UNITED 1999 PLUS`}
        />
        <meta
          name="keywords"
          content={`หมวดหมู่สินค้า, ${category.name}, UNITED 1999 PLUS`}
        />
        <meta
          property="og:title"
          content={`หมวดหมู่: ${category.name} - UNITED 1999 PLUS`}
        />
        <meta
          property="og:description"
          content={`เลือกดูสินค้าหมวดหมู่ ${category.name} จาก UNITED 1999 PLUS`}
        />
        <meta
          property="og:url"
          content={`https://united1999plus.vercel.app/category/${nameSlug}`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`หมวดหมู่: ${category.name} - UNITED 1999 PLUS`}
        />
        <meta
          name="twitter:description"
          content={`เลือกดูสินค้าหมวดหมู่ ${category.name} จาก UNITED 1999 PLUS`}
        />
        <meta
          name="twitter:image"
          content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Navbar />
      <div className="container mx-auto">
        <div className="mt-10">
          <h1 className="font-bold text-xl text-black">
            หมวดหมู่: {category.name}
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
          {currentProducts.map((item) => (
            <Card
              key={item.productId}
              className="hover:shadow-xl hover:border-[#204d9c] border flex flex-col"
              onClick={() => setSelectedProductId(item.productId)}
            >
              <CardHeader className="border-b">
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="max-h-full"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="line-clamp-2">{item.name}</CardTitle>
              </CardContent>
              <CardFooter className="flex justify-between p-4  border-t">
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
      </div>
      {selectedProductId && (
        <ProductDetail
          productId={selectedProductId}
          open={!!selectedProductId}
          setOpen={setSelectedProductId}
        />
      )}
      <Footer />
    </>
  );
};

export default CategoryPage;
