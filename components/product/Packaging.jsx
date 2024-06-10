"use client";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/spinner/Spinner";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Packaging = () => {
  const { data: category, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/packaging`,
    fetcher,
    {
     
    
      dedupingInterval: 60000, // เก็บ cache ไว้ใน 60 วินาที เพื่อป้องกันการดึงข้อมูลซ้ำเกินไป


    }
  );

  if (error) return <div>Failed to load</div>; // ถ้ามี error ให้แสดงข้อความว่า "Failed to load"
  if (!category)
    // ถ้าไม่มีข้อมูลให้แสดง spinner
    return (
      <div className="flex justify-center">
        <Loading />
      </div>
    );

  const products = category?.Product || [];

  return (
    <>
      <div className="mt-10">
        <h1 className="font-bold text-xl text-black">บรรจุภัณฑ์เฟสต์</h1>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
          {products.map((item) => (
            <Card
              key={item.productId}
              className="hover:shadow-xl border overflow-hidden "
            >
              <Link href={`/products/${item.productId}`}>
                <CardHeader className="border-b w-full h-60 relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </CardHeader>
              </Link>
              <CardContent className="">
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

export default Packaging;
