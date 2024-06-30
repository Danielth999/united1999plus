import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductDetailWrapper from "@/components/product/action/ProductDetailWrapper";
import Loading from "@/components/spinner/Spinner";
async function fetchOfficeSuppliesData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/office-supplies?limit=10`,
    {
      cache: "no-store" // Revalidate every minute
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function OfficeSupplies() {
  const category = await fetchOfficeSuppliesData();
  const products = category?.Product || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: "อุปกรณ์สำนักงาน",
    description: "อุปกรณ์สำนักงานจาก UNITED 1999 PLUS",
    url: "https://united1999plus.vercel.app/category/office-supplies",
    image: products.map((item) => item.imageUrl),
    brand: {
      "@type": "Brand",
      name: "UNITED 1999 PLUS",
      logo: "https://united1999plus.vercel.app/logo/logo-real-no-bg.png",
    },
    category: "Office Supplies",
    product: products.map((item) => ({
      "@type": "Product",
      name: item.name,
      image: item.imageUrl,
      url: `https://united1999plus.vercel.app/product/${item.productId}`,
      description: item.description,
      sku: item.sku,
      brand: {
        "@type": "Brand",
        name: "UNITED 1999 PLUS",
      },
    })),
  };

  return (
    <>
      <Head>
        <title>อุปกรณ์สำนักงาน - UNITED 1999 PLUS</title>
        <meta
          name="description"
          content="อุปกรณ์สำนักงานจาก UNITED 1999 PLUS"
        />
        {/* ... (other meta tags remain the same) ... */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <main>
        <section className="mt-10">
          <h1 className="font-bold text-xl text-black">อุปกรณ์สำนักงาน</h1>
        </section>
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
            {products.map((item) => (
                <Suspense key={item.productId} fallback={<Loading />}>
              <ProductDetailWrapper
                key={item.productId}
                productId={item.productId}
              >
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
              </ProductDetailWrapper>
              </Suspense>
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
