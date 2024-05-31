"use client";
import { useState, useEffect } from "react";
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

const CleaningProducts = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setProduct(data);
      } else {
        console.error("Data received from API is not an array", data);
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <>
      <div className="mt-10">
        <h1 className="font-bold text-xl text-black ">
        อุปกรณ์สำนักงาน
        </h1>
      </div>
      {loading ? (
        <div className="flex justify-center mt-10">
          <Loading />
        </div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
            {product.map((item) => (
              <Card
                key={item.productId}
                className="hover:shadow-xl border flex flex-col"
              >
                <CardHeader className="border-b">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="max-h-full"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle className="line-clamp-2">{item.name}</CardTitle>
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
        </div>
      )}
    </>
  );
};

export default CleaningProducts;
