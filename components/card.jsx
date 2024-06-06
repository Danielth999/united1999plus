import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useSWR from "swr";

const card = () => {
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
      {products.map((item) => (
        <Card key={item.productId}>
          <CardHeader>
            <Link href={`/products/${item.productId}`}>
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                style={{ objectFit: "contain" }}
                className="max-h-full"
              />
            </Link>
          </CardHeader>
          <CardContent>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default card;
