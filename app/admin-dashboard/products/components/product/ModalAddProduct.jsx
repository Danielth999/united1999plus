"use client";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/spinner/Spinner";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const ModalAddProduct = ({ onProductAdded }) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/api/category"
      );
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.name || !formData.description || !formData.price || !formData.categoryId || !formData.image) {
      toast({
        title: "Error",
        description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        status: "error",
        variant: "destructive",
      
        isClosable: true,
      });
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("categoryId", formData.categoryId);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/api/products",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "เพิ่มสินค้าสำเร็จ",
          status: "success",
          variant: "success",
        
          isClosable: true,
        });
        onProductAdded(response.data);
        setOpen(false); // Close the dialog
        setPreviewImage(null); // Clear preview image
        setFormData({
          name: "",
          description: "",
          price: "",
          categoryId: "",
          image: null,
        });
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการเพิ่มสินค้า",
        status: "error",
        variant: "destructive",
      
        isClosable: true,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#204d9c] text-white">เพิ่มสินค้าใหม่</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
          <DialogDescription>
            กรุณากรอกข้อมูลเพื่อเพิ่มสินค้าใหม่
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="info" className="w-full">
          <TabsList>
            <TabsTrigger value="info">ข้อมูลสินค้า</TabsTrigger>
            <TabsTrigger value="upload">อัปโหลดรูปภาพ</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TabsContent value="info">
              <div className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="ชื่อผลิตภัณฑ์"
                 
                />
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="รายละเอียด"
                 
                />
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="ราคา"
                 
                />
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                 
                  className="w-full border rounded p-2"
                >
                  <option value="" disabled>
                    เลือกหมวดหมู่
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId.toString()}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </TabsContent>
            <TabsContent value="upload">
              <div className="space-y-4">
                <Input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                 
                />
                {previewImage && (
                  <div className="flex justify-center">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddProduct;
