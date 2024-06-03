"use client";
import { Menu, Search, Bell, MessageCircle, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
const AdminBar = ({ toggleSidebar }) => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center">
        <button onClick={toggleSidebar}>
          <Menu className="text-gray-800" />
        </button>
        <h1 className="ml-4 text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <User className="text-gray-800" />
        {session && (
          <>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {session.user.email}
              </p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBar;
