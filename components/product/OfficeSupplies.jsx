import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo/logo.png";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function fetchOfficeSuppliesData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/office-supplies?limit=10`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    console.error("Failed to fetch data from server");
  }
  return res.json();
}

export default async function OfficeSupplies() {
  const category = await fetchOfficeSuppliesData();
  const products = category?.Product || [];

  return (
    <>
      <main>
        <section className="mt-10">
          <h1 className="font-bold text-xl text-black">อุปกรณ์สำนักงาน</h1>
        </section>
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
            {products.map((item) => (
              <Link key={item.productId} href={`/detail/${item.name}?id=${item.productId}`}>
                  <Card className="hover:shadow-xl hover:border-[#204d9c] border flex flex-col">
                    <CardHeader className="border-b w-full h-60 relative">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        style={{ objectFit: "contain" }}
                        className="max-h-full"
                        priority={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardTitle className="line-clamp-2">
                        {item.name}
                      </CardTitle>
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
              </Link>
            ))}
          </div>
          {products.length === 10 && (
            <div className="flex justify-center mt-5">
              <Link
                href="/category/office-supplies"
                className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
              >
                ดูเพิ่มเติม
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
