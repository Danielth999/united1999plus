"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Spinner from "@/components/spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModalEditProduct from "../components/product/ModalEditProduct";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ProductDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const {
    data: productData,
    error,
    mutate,
  } = useSWR(
    id ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}` : null,
    fetcher,
    { dedupingInterval: 60000 }
  );
  const [openEditModal, setOpenEditModal] = useState(false);

  if (!productData && !error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error fetching product data</div>;
  }

  return (
    <div className="   ">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="hover:bg-gray-100"
            >
              ← กลับ
            </Button>
            <Button 
              onClick={() => setOpenEditModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              แก้ไขสินค้า
            </Button>
          </div>
          <div className="flex flex-col md:flex-row">
            {productData.imageUrl && (
              <div className="md:w-1/3 mb-6 md:mb-0">
                <Image
                  src={productData.imageUrl}
                  alt={productData.name}
                  width={400}
                  height={400}
                  className="rounded-lg shadow-md object-cover w-full h-auto"
                />
              </div>
            )}
            <div className="md:w-2/3 md:pl-8">
              <CardTitle className="text-3xl font-bold mb-4">
                {productData.name}
              </CardTitle>
              <CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InfoItem label="รายละเอียด" value={productData.description} />
                  <InfoItem label="จำนวน" value={productData.stock} />
                  <InfoItem label="สี" value={productData.color} />
                  <InfoItem label="ขนาด" value={productData.size} />
                  <InfoItem label="หมวดหมู่" value={productData.Category.name} />
                  <InfoItem 
                    label="สถานะการเผยแพร่" 
                    value={
                      <Badge variant={productData.isPublished ? "success" : "secondary"}>
                        {productData.isPublished ? "เผยแพร่" : "ไม่เผยแพร่"}
                      </Badge>
                    } 
                  />
                  <InfoItem 
                    label="วันที่สร้าง" 
                    value={new Date(productData.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })} 
                  />
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      {openEditModal && (
        <ModalEditProduct
          product={productData}
          onProductUpdated={(updatedProduct) => {
            mutate(updatedProduct, false);
            setOpenEditModal(false);
          }}
        />
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <span className="font-semibold text-gray-700">{label}:</span>{" "}
    <span className="text-gray-600">{value}</span>
  </div>
);

export default ProductDetail;
