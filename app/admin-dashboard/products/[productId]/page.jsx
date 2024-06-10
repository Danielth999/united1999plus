"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ModalEditProduct from "../components/product/ModalEditProduct";

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = useParams();
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`
        );
        setProductData(response.data);
      } catch (error) {
        setError(error);
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching product data</div>;
  }

  if (!productData) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <Button variant="destructive" onClick={() => router.back()} className="mb-4">
              กลับ
            </Button>
            <Button onClick={() => setOpenEditModal(true)} className="mb-4">
              แก้ไข
            </Button>
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            {productData.name}
          </CardTitle>
          <CardDescription>
            <div className="flex flex-col md:flex-row items-start md:items-center">
              {productData.imageUrl && (
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <Image
                    src={productData.imageUrl}
                    alt={productData.name}
                    width={300}
                    height={300}
                    className="object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              <div className="md:ml-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <p className="text-lg">
                    <strong>รายละเอียด:</strong> {productData.description}
                  </p>
                  <p className="text-lg">
                    <strong>ราคา:</strong> {productData.price} บาท
                  </p>
                  <p className="text-lg">
                    <strong>จำนวน:</strong> {productData.stock}
                  </p>
                  <p className="text-lg">
                    <strong>สี:</strong> {productData.color}
                  </p>
                  <p className="text-lg">
                    <strong>ขนาด:</strong> {productData.size}
                  </p>
                  <p className="text-lg">
                    <strong>หมวดหมู่:</strong> {productData.Category.name}
                  </p>
                  <p className="text-lg">
                    <strong>สถานะการเผยแพร่:</strong>{" "}
                    {productData.isPublished ? "เผยแพร่" : "ไม่เผยแพร่"}
                  </p>
                  <p className="text-lg">
                    <strong>วันที่สร้าง:</strong>{" "}
                    {new Date(productData.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      {openEditModal && (
        <ModalEditProduct
          product={productData}
          onProductUpdated={(updatedProduct) => {
            setProductData(updatedProduct);
            setOpenEditModal(false);
          }}
        />
      )}
    </>
  );
};

export default ProductDetail;
