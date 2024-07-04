import Image from "next/image";
import logo from "@/public/logo/logo.png";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


// ฟังก์ชันเพื่อดึงข้อมูลบรรจุภัณฑ์จาก API
async function fetchPackagingData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/packaging?limit=10`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    console.error("Failed to fetch data from server");
  }
  return res.json();
}


// ฟังก์ชันเริ่มต้นเพื่อเรนเดอร์หน้าแสดงบรรจุภัณฑ์
export default async function Packaging() {
  const category = await fetchPackagingData();
  const products = category?.Product || [];

  return (
    <main>
      <section className="mt-10">
        <h1 className="font-bold text-xl text-black">บรรจุภัณฑ์เฟสต์</h1>
      </section>
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
          {products.map((item) => (
            <Link key={item.productId} href={`/detail/${item.name}?id=${item.productId}`}>
              <Card className="hover:shadow-xl hover:border-blue-500 border flex flex-col">
                <CardHeader className="border-b w-full h-60 relative">
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
              href={"/category/packaging"}
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
