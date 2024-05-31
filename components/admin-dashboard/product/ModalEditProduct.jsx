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
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const ModalEditProduct = ({ product, onProductUpdated }) => {
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    subcategoryId: "",
    image: null,
  });

  const [subcategories, setSubcategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setEditProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        subcategoryId: product.subcategory?.id || "",
        image: null,
      });
      setPreviewImage(product.imageUrl || null);
      setOpen(true); // Open the dialog
    }
  }, [product]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/sub-category`);
        setSubcategories(res.data.subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditProduct({ ...editProduct, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("description", editProduct.description);
    formData.append("price", editProduct.price);
    formData.append("stock", editProduct.stock);
    formData.append("subcategoryId", editProduct.subcategoryId);
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
      onProductUpdated(); // Refresh the product list
      setOpen(false); // Close the dialog
      setPreviewImage(null); // Clear preview image
    } catch (error) {
      console.log("Error updating product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขผลิตภัณฑ์</DialogTitle>
          <DialogDescription>กรุณากรอกข้อมูลเพื่อแก้ไขผลิตภัณฑ์</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-row space-x-4">
          <div className="space-y-4 flex-1">
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
            <Input
              type="number"
              name="stock"
              value={editProduct.stock}
              onChange={handleChange}
              placeholder="จำนวนสินค้า"
              required
            />
            <Select
              name="subcategoryId"
              value={editProduct.subcategoryId}
              onValueChange={(value) => setEditProduct((prevData) => ({ ...prevData, subcategoryId: value }))}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกหมวดหมู่ย่อย" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="file"
              name="image"
              onChange={handleFileChange}
            />
          </div>
          {previewImage && (
            <div className="flex-shrink-0">
              <Image src={previewImage} alt="Preview" width={200} height={200} className="object-cover" />
            </div>
          )}
          <div className="flex flex-col justify-end space-y-2 mt-4">
            <Button type="submit" className="bg-[#204d9c] text-white">บันทึก</Button>
            <Button type="button" variant="destructive" onClick={() => setOpen(false)}>ยกเลิก</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditProduct;
