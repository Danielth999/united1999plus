"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const ModalEditProduct = ({ product, onProductUpdated }) => {
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setEditProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId || "",
        image: null,
      });
      setPreviewImage(product.imageUrl || null);
      setOpen(true); // Open the dialog
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/api/category"
      );
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditProduct((prevData) => ({
      ...prevData,
      image: file,
    }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("description", editProduct.description);
    formData.append("price", editProduct.price);
    formData.append("categoryId", editProduct.categoryId);
    if (editProduct.image) {
      formData.append("image", editProduct.image);
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${product.productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        onProductUpdated(response.data);
        setOpen(false); // Close the dialog
        setPreviewImage(null); // Clear preview image
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#204d9c] hidden text-white">แก้ไขสินค้า</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขสินค้า</DialogTitle>
          <DialogDescription>กรุณากรอกข้อมูลเพื่อแก้ไขสินค้า</DialogDescription>
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
                  value={editProduct.name}
                  onChange={handleChange}
                  placeholder="ชื่อผลิตภัณฑ์"
                  required
                />
                <Textarea
                  name="description"
                  value={editProduct.description}
                  onChange={handleChange}
                  placeholder="รายละเอียด"
                  required
                />
                <Input
                  type="number"
                  name="price"
                  value={editProduct.price}
                  onChange={handleChange}
                  placeholder="ราคา"
                  required
                />
                <Select
                  name="categoryId"
                  value={editProduct.categoryId}
                  onValueChange={(value) =>
                    setEditProduct((prevData) => ({
                      ...prevData,
                      categoryId: value,
                    }))
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default ModalEditProduct;
