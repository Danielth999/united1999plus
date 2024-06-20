"use client";
import React, { useState } from "react";
import Head from "next/head";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const RegisterPage = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast({
        title: "เกิดข้อผิดพลาด!",
        description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        variant: "destructive",
      });
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
        toast({
          title: "สำเร็จ!",
          description: "สมัครสมาชิกสำเร็จ โปรดเข้าสู่ระบบ",
          variant: "success",
        });
        setUserName("");
        setEmail("");
        setPassword("");

        // เก็บอีเมลใน localStorage
        localStorage.setItem("registeredEmail", email);

        router.push("/login");
      } else {
        toast({
          title: "เกิดข้อผิดพลาด!",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "เกิดข้อผิดพลาด!",
        description: "มีบางอย่างผิดพลาดหรืออีเมลซ้ำ",
        variant: "destructive",
      });
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "สมัครสมาชิก - UNITED 1999 PLUS",
    url: "https://united1999plus.vercel.app/register",
    description:
      "สมัครสมาชิกเพื่อเข้าถึงบริการและผลิตภัณฑ์ของ UNITED 1999 PLUS",
  };

  return (
    <>
      <Head>
        <title>สมัครสมาชิก - UNITED 1999 PLUS</title>
        <meta
          name="description"
          content="สมัครสมาชิกเพื่อเข้าถึงบริการและผลิตภัณฑ์ของ UNITED 1999 PLUS"
        />
        <meta
          name="keywords"
          content="สมัครสมาชิก, UNITED 1999 PLUS, บริการ, ผลิตภัณฑ์"
        />
        <meta property="og:title" content="สมัครสมาชิก - UNITED 1999 PLUS" />
        <meta
          property="og:description"
          content="สมัครสมาชิกเพื่อเข้าถึงบริการและผลิตภัณฑ์ของ UNITED 1999 PLUS"
        />
        <meta
          property="og:url"
          content="https://united1999plus.vercel.app/register"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="สมัครสมาชิก - UNITED 1999 PLUS" />
        <meta
          name="twitter:description"
          content="สมัครสมาชิกเพื่อเข้าถึงบริการและผลิตภัณฑ์ของ UNITED 1999 PLUS"
        />
        <meta
          name="twitter:image"
          content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Navbar />
      <div className="flex justify-center mt-10">
        <div className="max-w-md w-full bg-white shadow-lg rounded-md p-8">
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
