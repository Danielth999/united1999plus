"use client";

import axios from "axios";
import useSWR from "swr";
import Loading from "@/components/spinner/Spinner";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Dashboard = () => {
  const { data: usersData, error: usersError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
    fetcher,
    { dedupingInterval: 60000, revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const { data: categoriesData, error: categoriesError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
    fetcher,
    { dedupingInterval: 60000, revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const { data: productsData, error: productsError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    fetcher,
    { dedupingInterval: 60000, revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  if (usersError || categoriesError || productsError) {
    return <div>Error loading data</div>;
  }

  if (!usersData || !categoriesData || !productsData) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold">{usersData.length}</h2>
          <p>สมาชิกทั้งหมด</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold">{categoriesData.length}</h2>
          <p>หมวดหมู่ทั้งหมด</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold">{productsData.length}</h2>
          <p>จำนวนสินค้า</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
