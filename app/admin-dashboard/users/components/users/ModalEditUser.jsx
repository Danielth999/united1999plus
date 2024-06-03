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
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.userId}`, editUser);
      onUserUpdated(); // Fetch users again to update the list
      setOpen(false); // Close the dialog
    } catch (error) {
      console.log("Error updating user:", error);
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
                required
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
                required
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
                required
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
