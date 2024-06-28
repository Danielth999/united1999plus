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
        <div className="w-full max-w-xl py-6">
          <header className="text-center">
            <h1 className="mb-2 inline-flex items-center gap-2 text-2xl font-bold">
              <img src="/logo/logo-real-no-bg.png" width="40" height="auto" alt="logo company" />
              <span className="text-[#0571cc]">United 1999 Plus</span>
            </h1>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              ยินดีตอนรับ, กรุณาสมัครสมาชิกเพื่อเข้าสู่ระบบ
            </h2>
          </header>

          <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="grow p-5 md:px-16 md:py-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="username" className="text-sm font-medium">ชื่อผู้ใช้</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                    placeholder="ชื่อผู้ใช้"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium">อีเมล</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                    placeholder="อีเมล"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium">รหัสผ่าน</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#0571cc] bg-[#0571cc] px-6 py-3 font-semibold leading-6 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400/50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400/90"
                  >
                    <svg
                      className="hi-mini hi-arrow-uturn-right inline-block size-5 opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.207 2.232a.75.75 0 00.025 1.06l4.146 3.958H6.375a5.375 5.375 0 000 10.75H9.25a.75.75 0 000-1.5H6.375a3.875 3.875 0 010-7.75h10.003l-4.146 3.957a.75.75 0 001.036 1.085l5.5-5.25a.75.75 0 000-1.085l-5.5-5.25a.75.75 0 00-1.06.025z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>สมัครสมาชิก</span>
                  </button>
                </div>
              </form>
            </div>
            <div className="grow p-5 text-center text-sm md:px-16">
              มีบัญชีแล้วใช่ไหม?
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-400">
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterPage;