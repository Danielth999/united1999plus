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
import { useToast } from "@/components/ui/use-toast";

const ModalEditCategory = ({ category, onCategoryUpdated }) => {
  const { toast } = useToast();
  const [editCategory, setEditCategory] = useState({
    name: "",
    nameSlug: "",
    cateImg: null,
  });
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (category) {
      setEditCategory({
        name: category.name,
        nameSlug: category.nameSlug,
        cateImg: category.cateImg || null,
      });
      setOpen(true);
      setPreviewImage(category.cateImg ? category.cateImg : null);
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditCategory({ ...editCategory, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditCategory({ ...editCategory, cateImg: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const optimisticCategory = {
      ...category,
      ...editCategory,
      cateImg: previewImage,
    };
    onCategoryUpdated((prevCategories) =>
      prevCategories.map((cat) =>
        cat.categoryId === category.categoryId ? optimisticCategory : cat
      )
    ); // Optimistically update UI

    try {
      const formData = new FormData();
      formData.append("name", editCategory.name);
      formData.append("nameSlug", editCategory.nameSlug);
      if (editCategory.cateImg && typeof editCategory.cateImg !== "string") {
        formData.append("cateImg", editCategory.cateImg);
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${category.categoryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Success",
        description: "แก้ไขหมวดหมู่สำเร็จ",
        status: "success",
        variant: "success",
        isClosable: true,
      });
    } catch (error) {
      onCategoryUpdated((prevCategories) =>
        prevCategories.map((cat) =>
          cat.categoryId === category.categoryId ? category : cat
        )
      ); // Revert UI change
      console.log("Error updating category:", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
    } finally {
      setOpen(false); // Close the dialog
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขหมวดหมู่</DialogTitle>
          <DialogDescription>
            กรุณากรอกข้อมูลเพื่อแก้ไขหมวดหมู่
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                ชื่อหมวดหมู่
              </label>
              <Input
                type="text"
                name="name"
                id="name"
                value={editCategory.name}
                onChange={handleChange}
                placeholder="ชื่อหมวดหมู่"
                required
              />
            </div>
            <div>
              <label
                htmlFor="nameSlug"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                ชื่อหมวดหมู่ภาษาอังกฤษ
              </label>
              <Input
                type="text"
                name="nameSlug"
                id="nameSlug"
                value={editCategory.nameSlug}
                onChange={handleChange}
                placeholder="ชื่อหมวดหมู่ภาษาอังกฤษ"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cateImg"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
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
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="object-cover w-32 h-32"
                  />
                </div>
              )}
            </div>
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
