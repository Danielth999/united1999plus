'use client'
import React, { useState } from "react"; // Import React and useState together
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected import path

const LoginPage = () => {
  const [email, setEmail] = useState(""); // Assuming you are using email for login
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,  // Ensure your backend is expecting 'email'
        password,
      });

      if (result.error) {
        console.error(result.error);
      } else {
        router.push('/'); // Redirect on successful login
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  
  return (
    <>
      <Navbar  />
      <div className="flex justify-center mt-10">
        <div className="max-w-md w-full bg-white shadow-lg rounded-md p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                placeholder="john@doe.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">รหัสผ่าน</label>
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
              <button className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">เข้าสู่ระบบ</button>
            </div>
            <div className="text-center text-gray-600">
              
              <div>
                <span>
                  ยังไม่ได้เป็นสมาชิก ? <Link href="/register"><span className="underline hover:text-blue-600">สมัครสมาชิก</span></Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
