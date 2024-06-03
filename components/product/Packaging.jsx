// pages/index.js
'use client';

import { useEffect, useState } from "react";
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

const Packaging = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="mt-10">
        <h1 className="font-bold text-xl text-black">บรรจุภัณฑ์เฟสท์</h1>
      </div>
      {loading ? (
        <div className="flex justify-center mt-10">
          <Loading />
        </div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
            {products.map((item) => (
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
                      style={{ objectFit: "contain" }}
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

export default Packaging;
