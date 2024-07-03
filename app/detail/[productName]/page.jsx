import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetailsClient from '@/components/product/ProductDetailsClient';
import Navbar from '@/components/nav/Navbar'
// ฟังก์ชันเพื่อดึงข้อมูลสินค้าจาก API
async function fetchProductData(productId) {
  // ตรวจสอบว่ามีการส่ง productId เข้ามาหรือไม่
  if (!productId) {
    throw new Error("Product ID is required"); // ถ้าไม่มี ให้ส่งข้อผิดพลาด
  }

  try {
    // ดึงข้อมูลสินค้าจาก API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
      cache: "no-store", // ปิดการแคชเพื่อให้ได้ข้อมูลใหม่เสมอ
    });

    // จัดการกับกรณีที่การตอบกลับจากเซิร์ฟเวอร์ไม่ใช่ OK
    if (!res.ok) {
      if (res.status === 404) {
        notFound(); // ถ้าพบสถานะ 404 ให้ไปยังหน้า 404
      }
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้ส่งข้อผิดพลาด
    }

    // คืนค่าข้อมูล JSON จากการตอบกลับ
    return res.json();
  } catch (error) {
    console.error("Error fetching product data:", error); // แสดงข้อผิดพลาดใน console
    throw error; // ส่งต่อข้อผิดพลาดเพื่อให้ผู้เรียกใช้ฟังก์ชันจัดการ
  }
}

// ฟังก์ชันเพื่อสร้าง metadata สำหรับหน้ารายละเอียดสินค้า
export async function generateMetadata({ params, searchParams }) {
  try {
    // ดึง productId จาก search parameters
    const productId = searchParams.id;
    // ดึงข้อมูลสินค้าด้วยฟังก์ชัน fetchProductData
    const product = await fetchProductData(productId);

    // คืนค่า metadata สำหรับหน้ารายละเอียดสินค้า
    return {
      title: `${product.name} - UNITED 1999 PLUS`,
      description: `${product.description} จาก UNITED 1999 PLUS`,
      openGraph: {
        title: `${product.name} - UNITED 1999 PLUS`,
        description: product.description,
        images: [product.imageUrl],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - UNITED 1999 PLUS`,
        description: product.description,
        images: [product.imageUrl],
      },
    };
  } catch (error) {
    // คืนค่า metadata สำหรับกรณีที่เกิดข้อผิดพลาด
    return {
      title: "Product Not Found - UNITED 1999 PLUS",
      description: "The requested product could not be found.",
    };
  }
}

// ฟังก์ชันเริ่มต้นเพื่อเรนเดอร์หน้ารายละเอียดสินค้า
export default async function ProductDetail({ params, searchParams }) {
  // ดึง productId จาก search parameters
  const productId = searchParams.id;

  try {
    // ดึงข้อมูลสินค้าด้วยฟังก์ชัน fetchProductData
    const product = await fetchProductData(productId);

    // คืนค่า JSX สำหรับหน้ารายละเอียดสินค้า
    return (
      <> 
      <main>
      <Navbar />
          <ProductDetailsClient product={product} />
      </main>
      </>
    );
  } catch (error) {
    // คืนค่า JSX สำหรับกรณีที่เกิดข้อผิดพลาด
    return (
      <main>
        <Navbar />
        <section className="container mx-auto px-4">
          <div className="flex flex-col items-center mt-10">
            <h1 className="font-bold text-2xl text-black">Error</h1>
            <p className="mt-5">An error occurred while fetching product data. Please try again later.</p>
          </div>
        </section>
      </main>
    );
  }
}
