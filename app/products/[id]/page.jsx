"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "@/components/spinner/Spinner";
// components
import Navbar from "@/components/nav/Navbar";
import BreadcrumbComponent from "../components/Breadcrumb"; // นำเข้าจากตำแหน่งที่ถูกต้อง
// ui

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductID = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
      );

      if (res.data) {
        setProduct(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductID();
  }, [id]);

  return (
    <>
      <Navbar />
      {loading && (
        <div className="grid place-items-center items-center h-screen">
          <Spinner />
        </div>
      )}
      {!loading && (
        <>
          <section className="text-gray-600 body-font overflow-hidden">
            <div className="container px-5 py-16 mx-auto">
              <BreadcrumbComponent
                category={product.Category}
                productName={product.name}
              />
              <div className="flex flex-wrap">
                <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0 border p-2 rounded-sm">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    {product.Category.name}
                  </h2>
                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                    {product.name}
                  </h1>
                  <div className="flex mb-4">
                    <span className="flex-grow text-indigo-500 border-b-2 border-indigo-500 py-2 text-lg px-1">
                      รายละเอียดสินค้า
                    </span>
                  </div>
                  <p className="leading-relaxed mb-4">{product.description}</p>
                  <div className="flex border-t border-gray-200 py-2">
                    <span className="text-gray-500">สี</span>
                    <span className="ml-auto text-gray-900">แดง</span>
                  </div>
                  <div className="flex border-t border-gray-200 py-2">
                    <span className="text-gray-500">ขนาด</span>
                    <span className="ml-auto text-gray-900">ปานกลาง</span>
                  </div>
                  <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                    <span className="text-gray-500">จำนวน</span>
                    <span className="ml-auto text-gray-900">4</span>
                  </div>
                  <div className="flex">
                    <span className="title-font font-medium text-2xl text-gray-900">
                      ฿{product.price}
                    </span>
                    <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                      ถูกใจ
                    </button>
                    <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                      <svg
                        fill="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <Image
                  src={product && product.imageUrl ? product.imageUrl : ""}
                  width={500}
                  height={300}
                  alt={product.name}
                  className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default ViewProduct;
