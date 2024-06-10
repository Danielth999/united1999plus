"use client";
import React from "react";
import Dashboard from "./components/dashboard/Dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "loading") return; // รอให้ session โหลดเสร็จ
    if (!session || session.user.role !== "admin") {
      router.push("/"); // redirect ไปยังหน้าแรกถ้าไม่มีสิทธิ์
    }
  }, [session, status, router]);
  return (
    <>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
