"use client";
import { useState } from "react";
import Sidebar from "../../components/admin-dashboard/Sidebar";
import Navbar from "../../components/admin-dashboard/AdminBar";

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
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
