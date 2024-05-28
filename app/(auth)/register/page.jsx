"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          username,
          email,
          password,
        }
      );

      if (res.status === 200) {
        setSuccess("Successfully registered. Please login.");
        setError("");
        setUserName("");
        setEmail("");
        setPassword("");
        router.push("/login");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setError("มีบางอย่างผิดพลาดหรืออีเมลซ้ำ");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center mt-10">
        <div className="max-w-md w-full bg-white shadow-lg rounded-md p-8">
          {success && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">สำเร็จ!{success}</strong>
            </div>
          )}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">เกิดข้อผิดพลาด!{error}</strong>
            </div>
          )}
          <h2 className="text-3xl font-bold mb-6 text-center">สมัครสมาชิก</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-1">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="ชื่อผู้ใช้"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                อีเมล
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="อีเมล"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                สมัครสมาชิก
              </button>
            </div>
            <div className="text-center text-gray-600">
              <span>
                เป็นสมาชิกอยู่แล้ว ?{" "}
                <Link className="underline hover:text-blue-600" href="/login">
                  เข้าสู่ระบบ
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterPage;
