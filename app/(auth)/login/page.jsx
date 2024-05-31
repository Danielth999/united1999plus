"use client";
import React, { useState } from "react";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: result.error,
          status: "error",
          variant: "destructive",
        });
        console.error(result.error);
      } else {
        // Assuming the user information is in result.user
        toast({
          title: "ยินดีต้อนรับ",
          description: `ยินดีต้อนรับ, ${email}`,
          status: "success",
          variant: "success",
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        status: "error",
        variant: "destructive",
      });
      console.error("error", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center mt-10">
        <div className="max-w-md w-full bg-white shadow-lg rounded-md p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email
              </label>
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
                เข้าสู่ระบบ
              </button>
            </div>
            <div className="text-center text-gray-600">
              <div>
                <span>
                  ยังไม่ได้เป็นสมาชิก ?{" "}
                  <Link href="/register">
                    <span className="underline hover:text-blue-600">
                      สมัครสมาชิก
                    </span>
                  </Link>
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
