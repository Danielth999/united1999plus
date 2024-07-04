import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function fetchCleaningProductsData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/cleaning-products?limit=10`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    console.error("Failed to fetch data from server");
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function CleaningProducts() {
  const category = await fetchCleaningProductsData();
  const products = category?.Product || [];

  return (
    <main className="container mx-auto px-4">
      <section className="mt-10">
        <h1 className="font-bold text-xl text-black">ผลิตภัณฑ์ทำความสะอาด</h1>
      </section>
      <section className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((item) => (
            <Link
              key={item.productId}
              href={`/detail/${item.name}?id=${item.productId}`}
            >
              <Card className="hover:shadow-xl hover:border-[#204d9c] border flex flex-col h-full">
                <CardHeader className="border-b w-full h-60 relative p-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "contain" }}
                    className="max-h-full"
                    priority={true}
                  />
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle className="line-clamp-2">{item.name}</CardTitle>
                </CardContent>
                <CardFooter className="flex justify-between p-4 border-t">
                  <Badge
                    variant="customSecondary"
                    className="w-full text-center line-clamp-1"
                  >
                    {category.name}
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        {products.length === 10 && (
          <div className="flex justify-center mt-5">
            <Link
              href="/category/cleaning-products"
              className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
            >
              ดูเพิ่มเติม
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
