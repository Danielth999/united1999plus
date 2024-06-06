"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/AdminBar";
import { Toaster } from "@/components/ui/toaster";
const AdminLayout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex">
      <Sidebar isExpanded={isSidebarExpanded} />
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-4">
          {children}
          <Toaster />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
