'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

const Recomend = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProduct(data);
      } else {
        console.error("Data received from API is not an array", data);
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <>
      <div className="mt-10">
        <h1 className="font-bold text-xl text-black">สินค้าแนะนำ</h1>
      </div>
      {loading ? (
        <div className="flex justify-center ">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {product.map((item) => (
            <div
              key={item.productId}
              className="card card-compact w-50 bg-base-100 border hover:shadow-xl"
            >
              <figure className="border-b flex items-center justify-center h-48 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={300}
                  height={250}
                  objectFit="contain"
                  className="max-h-full"
                ></Image>
              </figure>
              <div className="card-body">
                <h2 className="card-title line-clamp-2">{item.name}</h2>
                <div className="card-actions justify-between">
                  <div className="badge badge-outline font-bold">
                    {item.price}฿
                  </div>
                  <div className="badge badge-outline">
                    {item.Category.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Recomend;
