"use client";
import { useState, useEffect } from "react";
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/packaging?limit=10`,
    fetcher,
    {
      dedupingInterval: 60000,
      refreshInterval: 60000,
    }
  );

  if (error) return <div>Failed to load</div>;
  if (!category)
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
              className="hover:shadow-xl border overflow-hidden"
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
              <CardContent>
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

        {products.length === 10 && (
          <div className="flex justify-center mt-5">
            <Link href={`/category/packaging`}>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600">
                ดูเพิ่มเติม
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Packaging;
