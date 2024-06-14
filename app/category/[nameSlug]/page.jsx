"use client";

import useSWR from "swr";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

  return (
    <>
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
        <Dialog
          open={!!selectedProductId}
          onOpenChange={() => setSelectedProductId(null)}
        >
          <DialogContent className="max-w-4xl mx-auto p-4">
            <DialogHeader>
              <DialogTitle>รายละเอียดสินค้า</DialogTitle>
            </DialogHeader>
            <ProductDetail productId={selectedProductId} />
          </DialogContent>
        </Dialog>
      )}
      <Footer />
    </>
  );
};

export default CategoryPage;
