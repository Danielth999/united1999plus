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
import { Checkbox } from "@/components/ui/checkbox";

const ModalAddProduct = ({ onProductAdded }) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    color: "",
    size: "",
    isPublished: false,
    unitType: "", // ล้างฟิลด์นี้
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
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
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
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.categoryId ||
      !formData.image ||
      !formData.stock ||
      !formData.color ||
      !formData.size ||
      !formData.unitType // ตรวจสอบฟิลด์นี้ด้วย
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

    const optimisticProduct = {
      ...formData,
      productId: Date.now(), // ใช้ timestamp เป็น productId ชั่วคราว
      imageUrl: previewImage,
    };

    onProductAdded(optimisticProduct); // อัปเดต UI ทันที

    setOpen(false); // ปิด Dialog
    setPreviewImage(null); // ล้างภาพตัวอย่าง
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      color: "",
      size: "",
      unitType: "", // ล้างฟิลด์นี้
      isPublished: false,
      categoryId: "",
      image: null,
    });

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("color", formData.color);
    data.append("size", formData.size);
    data.append("unitType", formData.unitType); // เพิ่มฟิลด์นี้
    data.append("isPublished", formData.isPublished);
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
        onProductAdded(response.data, optimisticProduct.productId); // อัปเดต UI ด้วย ID ที่ถูกต้อง
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
      // ย้อนกลับการเปลี่ยนแปลงใน UI
      onProductAdded(null, optimisticProduct.productId);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="ชื่อผลิตภัณฑ์"
                />
                <Input
                  type="text"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="จำนวน"
                />
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="ราคา"
                />
                <Input
                  type="text"
                  name="unitType"
                  value={formData.unitType}
                  onChange={handleChange}
                  placeholder="หน่วย"
                />

                <Input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="สี"
                />
                <Input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="ขนาด"
                />

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full borders rounded p-2 col-span-2"
                >
                  <option  disabled>
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
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="รายละเอียด"
                  className="col-span-2"
                />
                <div className="flex items-center space-x-2 col-span-1 md:col-span-2">
                  <Checkbox
                    name="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        isPublished: checked,
                      }))
                    }
                  />
                  <label>เผยแพร่</label>
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

export default ModalAddProduct;
