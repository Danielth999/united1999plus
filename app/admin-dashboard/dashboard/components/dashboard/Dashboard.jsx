import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, categoriesResponse, productsResponse] =
          await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/category`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`),
          ]);

        setUsersCount(usersResponse.data.length);
        setCategoriesCount(categoriesResponse.data.length);
        setProductsCount(productsResponse.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold">{usersCount}</h2>
          <p>User Registrations</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold">{categoriesCount}</h2>
          <p>Categories</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold">{productsCount}</h2>
          <p>Products</p>
        </div>
      </div>
      {/* ส่วนที่แสดงแผนภูมิและแผนที่ */}
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold mb-2">Sales</h2>
            {/* ใส่กราฟที่นี่ */}
            <div className="h-64 bg-gray-200">[Sales Graph]</div>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold mb-2">Visitors</h2>
            {/* ใส่แผนที่ที่นี่ */}
            <div className="h-64 bg-gray-200">[Visitors Map]</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
