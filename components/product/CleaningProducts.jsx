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
import ProductDetailWrapper from "@/components/product/action/ProductDetailWrapper";


async function fetchCleaningProductsData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/cleaning-products?limit=10`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    console.error("Failed to fetch data from server");
  }
  return res.json();
}

export async function generateMetadata() {
  const category = await fetchCleaningProductsData();
  const products = category?.Product || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: ["ผลิตภัณฑ์ทำความสะอาด", "Cleaning Products", "UNITED 1999 PLUS"],
    description: "ผลิตภัณฑ์ทำความสะอาดจาก UNITED 1999 PLUS",
    url: "https://united1999plus.vercel.app/category/cleaning-products",
    image: products.map((item) => item.imageUrl),
    brand: {
      "@type": "Brand",
      name: "UNITED 1999 PLUS",
      logo: logo.src,
    },
    category: ["ผลิตภัณฑ์ทำความสะอาด", "Cleaning Products"],
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

  return {
    title: "ผลิตภัณฑ์ทำความสะอาด - UNITED 1999 PLUS",
    description: "ผลิตภัณฑ์ทำความสะอาดจาก UNITED 1999 PLUS",
    keywords: "ผลิตภัณฑ์ทำความสะอาด, UNITED 1999 PLUS, ผลิตภัณฑ์ทำความสะอาดคุณภาพ",
    openGraph: {
      title: "ผลิตภัณฑ์ทำความสะอาด - UNITED 1999 PLUS",
      description: "ผลิตภัณฑ์ทำความสะอาดจาก UNITED 1999 PLUS",
      images: [logo.src],
      url: "https://united1999plus.vercel.app/category/cleaning-products",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "ผลิตภัณฑ์ทำความสะอาด - UNITED 1999 PLUS",
      description: "ผลิตภัณฑ์ทำความสะอาดจาก UNITED 1999 PLUS",
      images: [logo.src],
    },
    other: {
      "application-ld+json": JSON.stringify(structuredData),
    },
  };
}

export default async function CleaningProducts() {
  const category = await fetchCleaningProductsData();
  const products = category?.Product || [];

  return (
    <>
      
      <main>
        <section className="mt-10">
          <h1 className="font-bold text-xl text-black">ผลิตภัณฑ์ทำความสะอาด</h1>
        </section>
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">
            {products.map((item) => (
              <Suspense key={item.productId} >
                <ProductDetailWrapper productId={item.productId}>
                  <Card className="hover:shadow-xl hover:border-[#204d9c] border flex flex-col">
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
                </ProductDetailWrapper>
              </Suspense>
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
    </>
  );
}
