import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
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

async function fetchPackagingData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category/filter/packaging?limit=10`,
    {
      cache: "no-store"
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export async function generateMetadata() {
  const category = await fetchPackagingData();
  const products = category?.Product || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: "บรรจุภัณฑ์เฟสต์",
    description: "บรรจุภัณฑ์เฟสต์จาก UNITED 1999 PLUS",
    url: "https://united1999plus.vercel.app/category/packaging",
    image: products.map((item) => item.imageUrl),
    brand: {
      "@type": "Brand",
      name: "UNITED 1999 PLUS",
      logo: "https://united1999plus.vercel.app/logo/logo-real-no-bg.png",
    },
    category: "Packaging",
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
    title: "บรรจุภัณฑ์เฟสต์ - UNITED 1999 PLUS",
    description: "บรรจุภัณฑ์เฟสต์จาก UNITED 1999 PLUS",
    keywords: "บรรจุภัณฑ์, UNITED 1999 PLUS, บรรจุภัณฑ์เฟสต์",
    openGraph: {
      title: "บรรจุภัณฑ์เฟสต์ - UNITED 1999 PLUS",
      description: "บรรจุภัณฑ์เฟสต์จาก UNITED 1999 PLUS",
      images: ["https://united1999plus.vercel.app/logo/logo-real-no-bg.png"],
      url: "https://united1999plus.vercel.app/category/packaging",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "บรรจุภัณฑ์เฟสต์ - UNITED 1999 PLUS",
      description: "บรรจุภัณฑ์เฟสต์จาก UNITED 1999 PLUS",
      images: ["https://united1999plus.vercel.app/logo/logo-real-no-bg.png"],
    },
    other: {
      "application-ld+json": JSON.stringify(structuredData),
    },
  };
}

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
            <Suspense key={item.productId} fallback={<Loading />}>
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
