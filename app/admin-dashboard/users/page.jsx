'use client';
import UserList from "@/components/admin-dashboard/users/UserList";
// import { useSession, status } from "next-auth/react";
// import { useRouter } from "next/navigation";
const Users = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   if (status === "unauthenticated" || session?.user?.role !== "admin") {
//     router.push("/");
//   }
  return (
    <div>
      <UserList />
    </div>
  );
};

export default Users;
