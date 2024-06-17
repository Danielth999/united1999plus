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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

const ModalEditProduct = ({ product, onProductUpdated, open, setOpen }) => {
  const { toast } = useToast();
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

  useEffect(() => {
    if (product) {
      setEditProduct({
        name: product.name || "",
        description: product.description || "",
        stock: product.stock || "",
        color: product.color || "",
        size: product.size || "",
        isPublished: product.isPublished || false,
        categoryId: product.categoryId ? product.categoryId.toString() : "",
        image: null,
      });
      setPreviewImage(product.imageUrl || null);
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

    if (
      !editProduct.name ||
      !editProduct.description ||
      !editProduct.categoryId
    ) {
      toast({
        title: "Error",
        description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
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
      toast({
        title: "Success",
        description: "แก้ไขสินค้าสำเร็จ",
        status: "success",
        variant: "success",
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการแก้ไขสินค้า",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
      onProductUpdated(product);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  value={editProduct.name}
                  onChange={handleChange}
                  placeholder="ชื่อผลิตภัณฑ์"
                  className="col-span-2"
                />
                <Textarea
                  name="stock"
                  value={editProduct.stock}
                  onChange={handleChange}
                  placeholder="จำนวน"
                  className="col-span-2"
                />

                <Input
                  type="text"
                  name="color"
                  value={editProduct.color}
                  onChange={handleChange}
                  placeholder="สี"
                />
                <Input
                  type="text"
                  name="size"
                  value={editProduct.size}
                  onChange={handleChange}
                  placeholder="ขนาด"
                />
                <select
                  name="categoryId"
                  value={editProduct.categoryId}
                  onChange={handleChange}
                  className="w-full border rounded p-2 col-span-2"
                >
                  <option>เลือกหมวดหมู่</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId.toString()}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <Textarea
                  name="description"
                  value={editProduct.description}
                  onChange={handleChange}
                  placeholder="รายละเอียด"
                  className="col-span-2"
                />
                <div className="flex items-center space-x-2 col-span-1 md:col-span-2">
                  <Checkbox
                    name="isPublished"
                    checked={editProduct.isPublished}
                    onCheckedChange={(checked) =>
                      setEditProduct((prevData) => ({
                        ...prevData,
                        isPublished: checked,
                      }))
                    }
                  />
                  <span>เผยแพร่</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="upload">
              <div className="space-y-4">
                <Input type="file" name="image" onChange={handleFileChange} />
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
