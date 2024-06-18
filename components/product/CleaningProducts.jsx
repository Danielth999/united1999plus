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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useSWR from "swr";
import ProductDetail from "@/components/product/action/ProductDetail"; // นำเข้า ProductDetail จากตำแหน่งที่ถูกต้อง

const fetcher = (url) => axios.get(url).then((res) => res.data);

const CleaningProducts = () => {
  const { data: category, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/cleaning-products?limit=10`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 6000,
    }
  );

  const [selectedProductId, setSelectedProductId] = useState(null);

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
        <h1 className="font-bold text-xl text-black">ผลิตภัณฑ์ทำความสะอาด</h1>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
          {products.map((item) => (
            <Card
              key={item.productId}
              className="hover:shadow-xl hover:border-[#204d9c] border flex flex-col"
              onClick={() => setSelectedProductId(item.productId)}
            >
              <CardHeader className="border-b w-full h-60 relative">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="max-h-full"
                />
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="line-clamp-2">{item.name}</CardTitle>
              </CardContent>
              <CardFooter className="flex justify-between p-4 border-t">
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
            <button className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600">
              ดูเพิ่มเติม
            </button>
          </div>
        )}
      </div>

      {selectedProductId && (
        <ProductDetail
          productId={selectedProductId}
          open={!!selectedProductId}
          setOpen={setSelectedProductId}
        />
      )}
    </>
  );
};

export default CleaningProducts;
