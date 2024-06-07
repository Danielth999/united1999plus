"use client";

import { useState } from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/nav/Navbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/spinner/Spinner";

const fetcher = (url) => fetch(url).then((res) => res.json());

const CategoryPage = () => {
  const { nameSlug } = useParams();
  const { data: category, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/${nameSlug}`,
    fetcher
  );

  if (error) {
    return <div>Error fetching category</div>;
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center h-screen mt-10">
        <Loading />
      </div>
    );
  }

  if (!category.Product || category.Product.length === 0) {
    return <div>No products found in this category</div>;
  }

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
          {category.Product.map((item) => (
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
                  {category.name}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
