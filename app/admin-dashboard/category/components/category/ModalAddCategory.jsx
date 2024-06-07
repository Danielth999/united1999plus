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
import { useToast } from "@/components/ui/use-toast";

const ModalAddCategory = ({ onCategoryAdded }) => {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState({
    name: "",
    nameSlug: "",
    cateImg: null,
  });
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewCategory({ ...newCategory, cateImg: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("nameSlug", newCategory.nameSlug);
      if (newCategory.cateImg) {
        formData.append("cateImg", newCategory.cateImg);
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onCategoryAdded(); // Fetch categories again to update the list
      setOpen(false); // Close the dialog
      setNewCategory({ name: "", nameSlug: "", cateImg: null }); // Reset form
      setPreviewImage(null); // Clear preview image
      toast({
        title: "Success",
        description: "เพิ่มหมวดหมู่สำเร็จ",
        status: "success",
        variant: "success",
        isClosable: true,
      });
    } catch (error) {
      console.log("Error adding category:", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
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
          <DialogDescription>กรอกข้อมูลเพื่อเพิ่มหมวดหมู่ใหม่</DialogDescription>
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
            <div>
              <label htmlFor="cateImg" className="block text-gray-700 text-sm font-bold mb-2">
                อัปโหลดรูปภาพหมวดหมู่
              </label>
              <Input
                type="file"
                name="cateImg"
                id="cateImg"
                onChange={handleFileChange}
              />
              {previewImage && (
                <div className="mt-2 flex justify-center">
                  <img src={previewImage} alt="Preview" className="object-cover w-32 h-32" />
                </div>
              )}
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
