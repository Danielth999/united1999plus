"use client";
import { useEffect } from "react";
import useSWR from "swr";
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
import fetcher from "@/lib/fetcher";

const Packaging = () => {
  const {
    data: category,
    error,
    isValidating,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/packaging`,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000, // อัปเดตข้อมูลทุกๆ 30 วินาที
      dedupingInterval: 60000, // อนุญาตให้รีเฟรชข้อมูลใหม่ทุกๆ 60 วินาที
    }
  );

  const products = category?.Product || [];

  if (error) return <div>Failed to load</div>; // ถ้ามี error ให้แสดงข้อความว่า "Failed to load"
  if (!category)
    // ถ้าไม่มีข้อมูลให้แสดง spinner
    return (
      <div className="flex justify-center">
        <Loading />
      </div>
    );

  return (
    <>
      <div className="mt-10">
        <h1 className="font-bold text-xl text-black">บรรจุภัณฑ์เฟสท์</h1>
      </div>
      <div className="container mx-auto px-4">
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
