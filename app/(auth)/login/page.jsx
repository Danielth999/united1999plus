"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
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

  useEffect(() => {
    // ดึงอีเมลจาก localStorage และลบค่าออกจาก localStorage หลังจากดึง
    const registeredEmail = localStorage.getItem("registeredEmail");
    if (registeredEmail) {
      setEmail(registeredEmail);
      localStorage.removeItem("registeredEmail");
    }
  }, []);

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "เข้าสู่ระบบ - UNITED 1999 PLUS",
    url: "https://united1999plus.vercel.app/login",
    description: "เข้าสู่ระบบเพื่อเข้าถึงบริการและผลิตภัณฑ์ของ UNITED 1999 PLUS",
  };

  return (
    <>
      <Head>
        <title>เข้าสู่ระบบ - UNITED 1999 PLUS</title>
        <meta name="description" content="เข้าสู่ระบบเพื่อเข้าถึงบริการและผลิตภัณฑ์ของ UNITED 1999 PLUS" />
        <meta name="keywords" content="เข้าสู่ระบบ, UNITED 1999 PLUS, บริการ, ผลิตภัณฑ์" />
        <meta property="og:title" content="เข้าสู่ระบบ - UNITED 1999 PLUS" />
        <meta property="og:description" content="เข้าสู่ระบบเพื่อเข้าถึงบริการและผลิตภัณฑ์ของ UNITED 1999 PLUS" />
        <meta property="og:url" content="https://united1999plus.vercel.app/login" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="เข้าสู่ระบบ - UNITED 1999 PLUS" />
        <meta name="twitter:description" content="เข้าสู่ระบบเพื่อเข้าถึงบริการและผลิตภัณฑ์ของ UNITED 1999 PLUS" />
        <meta name="twitter:image" content="https://united1999plus.vercel.app/logo/logo-real-no-bg.png" />
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
              <img src="/logo/logo.png" width="40" height="auto" alt="logo company" />
              <span className="text-[#0571cc]">United 1999 Plus</span>
            </h1>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              ยินดีตอนรับ, กรุณาเข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ดของคุณ
            </h2>
          </header>

          <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="grow p-5 md:px-16 md:py-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium">อีเมล</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                    placeholder="กรอกอีเมลของคุณ"
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
                    placeholder="กรอกรหัสผ่านของคุณ"
                  />
                </div>
                <div>
                  <div className="mb-5 flex items-center justify-between gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember_me"
                        name="remember_me"
                        className="size-4 rounded border border-gray-200 text-blue-500 focus:border-blue-500 focus:ring focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:checked:border-transparent dark:checked:bg-blue-500 dark:focus:border-blue-500"
                      />
                      <span className="ml-2 text-sm">จดจำฉันไว้</span>
                    </label>
                    <a
                      href="/#"
                      className="inline-block hover:underline text-sm font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      ลืมรหัสผ่าน?
                    </a>
                  </div>
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
                    <span>เข้าสู่ระบบ</span>
                  </button>

                  <div className="my-5 flex items-center">
                    <span aria-hidden="true" className="h-0.5 grow rounded bg-gray-100"></span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                      หรือเข้าสู่ระบบด้วย
                    </span>
                    <span aria-hidden="true" className="h-0.5 grow rounded bg-gray-100"></span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300/25 active:border-gray-200 active:shadow-none"
                    >
                      <svg
                        className="bi bi-facebook inline-block size-4 text-[#1877f2]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path
                          d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
                        />
                      </svg>
                      <span>Facebook</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="grow p-5 text-center text-sm md:px-16">
              ยังไม่มีบัญชีใช่ไหม?
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-400">
                สมัครสมาชิก
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;