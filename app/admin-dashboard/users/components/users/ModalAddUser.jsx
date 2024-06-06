"use client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModalAddUser = ({ onUserAdded }) => {
  const { toast } = useToast();
  const [newUser, setNewUser] = useState({
    email: "",
    username: "",
    password: "",
    role: "user",
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!newUser.email || !newUser.username || !newUser.password || !newUser.role) {
      toast({
        title: "Error",
        description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        status: "error",
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, newUser);
      onUserAdded(); // Fetch users again to update the list
      setNewUser({ email: "", username: "", password: "", role: "user" }); // Reset form
      setOpen(false); // Close the dialog
      toast({
        title: "Success",
        description: "เพิ่มผู้ใช้ใหม่สำเร็จ",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.log("Error adding user:", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้ใหม่",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#204d9c] text-white">เพิ่มผู้ใช้ใหม่</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มสมาชิก</DialogTitle>
          <DialogDescription>กรุณากรอกข้อมูลเพื่อเพิ่มสมาชิกใหม่</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              placeholder="Email"
              
            />
            <Input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              placeholder="Username"
              
            />
            <Input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              placeholder="Password"
              
            />
            <Select
              name="role"
              value={newUser.role}
              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="สิทธิ์การใช้งาน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="submit" className="bg-[#204d9c] text-white">
              บันทึก
            </Button>
            <Button type="button" variant="destructive" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddUser;
