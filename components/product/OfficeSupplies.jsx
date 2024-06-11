"use client";
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

const OfficeSupplies = () => {
  const { data: category, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/office-supplies?limit=10`,
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
        <h1 className="font-bold text-xl text-black">อุปกรณ์สำนักงาน</h1>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
          {products.map((item) => (
            <Card
              key={item.productId}
              className="hover:shadow-xl border flex flex-col"
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
        {products.length > 0 && (
          <div className="flex justify-center mt-5">
            <Link href={`/category/office-supplies`}>
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

export default OfficeSupplies;
