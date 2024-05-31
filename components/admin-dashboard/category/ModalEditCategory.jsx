import { useState, useEffect } from "react";
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

const ModalEditCategory = ({ category, onCategoryUpdated }) => {
  const [editCategory, setEditCategory] = useState({
    name: "",
    nameSlug: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (category) {
      setEditCategory({
        name: category.name,
        nameSlug: category.nameSlug,
      });
      setOpen(true);
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditCategory({ ...editCategory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${category.categoryId}`,
        editCategory
      );
      onCategoryUpdated(); // Fetch categories again to update the list
      setOpen(false); // Close the modal
    } catch (error) {
      console.log("Error updating category:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขหมวดหมู่</DialogTitle>
          <DialogDescription>กรุณากรอกข้อมูลเพื่อแก้ไขหมวดหมู่</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              name="name"
              value={editCategory.name}
              onChange={handleChange}
              placeholder="ชื่อหมวดหมู่"
              required
            />
            <Input
              type="text"
              name="nameSlug"
              value={editCategory.nameSlug}
              onChange={handleChange}
              placeholder="ชื่อหมวดหมู่ภาษาอังกฤษ"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="submit" className="bg-[#204d9c] text-white">
              บันทึก
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setOpen(false)}
            >
              ยกเลิก
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditCategory;
