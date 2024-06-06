"use client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ModalEditUser = ({ user, onUserUpdated }) => {
  const { toast } = useToast();
  const [editUser, setEditUser] = useState({
    email: "",
    username: "",
    roles: "",
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setEditUser({
        email: user.email,
        username: user.username,
        roles: user.roles,
      });
      setOpen(true); // Open the dialog
    }
  }, [user]);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!editUser.email || !editUser.username || !editUser.roles) {
      toast({
        title: "Error",
        description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
      return;
    }

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.userId}`, editUser);
      onUserUpdated(); // Fetch users again to update the list
      setOpen(false); // Close the dialog
      toast({
        title: "Success",
        description: "แก้ไขข้อมูลผู้ใช้สำเร็จ",
        status: "success",
        variant:"success",
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
          <DialogDescription>กรุณากรอกข้อมูลเพื่อแก้ไขผู้ใช้</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                อีเมล
              </label>
              <Input
                type="text"
                name="email"
                id="email"
                value={editUser.email}
                onChange={handleChange}
                placeholder="Email"
                
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                ชื่อผู้ใช้
              </label>
              <Input
                type="text"
                name="username"
                id="username"
                value={editUser.username}
                onChange={handleChange}
                placeholder="Username"
                
              />
            </div>
            <div>
              <label htmlFor="roles" className="block text-gray-700 text-sm font-bold mb-2">
                สิทธิ์การใช้งาน
              </label>
              <Select
                name="roles"
                value={editUser.roles}
                onValueChange={(value) => setEditUser((prevData) => ({ ...prevData, roles: value }))}
                
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกสิทธิ์การใช้งาน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="user">user</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-center space-x-2 mt-4">
            <Button type="submit" className="bg-[#204d9c] text-white">บันทึก</Button>
            <Button type="button" variant="destructive" onClick={() => setOpen(false)}>ยกเลิก</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditUser;
