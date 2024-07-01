"use client";

import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

const ModalEditProduct = ({ product, onProductUpdated }) => {
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    stock: "",
    color: "",
    size: "",
    isPublished: false,
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
        stock: product.stock,
        color: product.color,
        size: product.size,
        isPublished: product.isPublished,
        categoryId: product.categoryId ? product.categoryId.toString() : "",
        image: null,
      });
      setPreviewImage(product.imageUrl || null);
      setOpen(true);
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
    const { name, value, type, checked } = e.target;
    setEditProduct((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
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
    if (!editProduct.name || !editProduct.description || !editProduct.categoryId) {
      toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const updatedProduct = { ...product, ...editProduct };
    onProductUpdated(updatedProduct);
    setOpen(false);
    setPreviewImage(null);

    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("description", editProduct.description);
    formData.append("stock", editProduct.stock);
    formData.append("color", editProduct.color);
    formData.append("size", editProduct.size);
    formData.append("isPublished", editProduct.isPublished);
    formData.append("categoryId", editProduct.categoryId);
    if (editProduct.image) {
      formData.append("image", editProduct.image);
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${product.productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("แก้ไขสินค้าสำเร็จ");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขสินค้า");
      onProductUpdated(product);
    }
  };

  return (
    <>
      <Toaster />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button  variant="outline">แก้ไขสินค้า</Button>
        </SheetTrigger>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>แก้ไขสินค้า</SheetTitle>
            <SheetDescription>กรุณากรอกข้อมูลเพื่อแก้ไขสินค้า</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="product-info">
              <TabsList>
                <TabsTrigger value="product-info">ข้อมูลสินค้า</TabsTrigger>
                <TabsTrigger value="image-upload">อัปโหลดรูปภาพ</TabsTrigger>
              </TabsList>
              <TabsContent value="product-info">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="col-span-4">
                      ชื่อสินค้า
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={editProduct.name}
                      onChange={handleChange}
                      className="col-span-4"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="col-span-4">
                      รายละเอียด
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={editProduct.description}
                      onChange={handleChange}
                      className="col-span-4"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="col-span-4">
                      จำนวนสินค้า
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={editProduct.stock}
                      onChange={handleChange}
                      className="col-span-4"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="color" className="col-span-4">
                      สี
                    </Label>
                    <Input
                      id="color"
                      name="color"
                      value={editProduct.color}
                      onChange={handleChange}
                      className="col-span-4"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="size" className="col-span-4">
                      ขนาด
                    </Label>
                    <Input
                      id="size"
                      name="size"
                      value={editProduct.size}
                      onChange={handleChange}
                      className="col-span-4"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Label htmlFor="categoryId" className="col-span-4">
                      หมวดหมู่
                    </Label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={editProduct.categoryId}
                      onChange={handleChange}
                      className="col-span-4"
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPublished"
                      name="isPublished"
                      checked={editProduct.isPublished}
                      onCheckedChange={(checked) =>
                        setEditProduct((prevData) => ({
                          ...prevData,
                          isPublished: checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="isPublished"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      เผยแพร่
                    </label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="image-upload">
                <Label htmlFor="picture">รูปภาพ</Label>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input id="picture" type="file" onChange={handleFileChange} />
                </div>
                {previewImage && (
                  <div className="mt-4">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <SheetFooter>
              <SheetClose asChild>
                <Button className="w-full" type="submit">
                  บันทึก
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ModalEditProduct;
