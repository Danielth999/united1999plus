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

const ModalAddCategory = ({ onCategoryAdded }) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    nameSlug: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
        newCategory
      );
      onCategoryAdded(); // Fetch categories again to update the list
      setOpen(false); // Close the dialog
      setNewCategory({ name: "", nameSlug: "" }); // Reset form
    } catch (error) {
      console.log("Error adding category:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#204d9c] text-white">เพิ่มหมวดหมู่</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มหมวดหมู่</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลเพื่อเพิ่มหมวดหมู่ใหม่
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                ชื่อหมวดหมู่
              </label>
              <Input
                type="text"
                name="name"
                id="name"
                value={newCategory.name}
                onChange={handleChange}
                placeholder="ชื่อหมวดหมู่"
                required
              />
            </div>
            <div>
              <label htmlFor="nameSlug" className="block text-gray-700 text-sm font-bold mb-2">
                ชื่อหมวดหมู่ภาษาอังกฤษ
              </label>
              <Input
                type="text"
                name="nameSlug"
                id="nameSlug"
                value={newCategory.nameSlug}
                onChange={handleChange}
                placeholder="ชื่อหมวดหมู่ภาษาอังกฤษ"
                required
              />
            </div>
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

export default ModalAddCategory;
