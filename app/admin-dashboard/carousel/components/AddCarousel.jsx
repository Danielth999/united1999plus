"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const AddCarousel = ({ onUpload }) => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const removeImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "กรุณาเลือกรูปภาพก่อนอัปโหลด",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/carousel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onUpload(response.data);
      setImages([]);
      setImagePreviews([]);
      setLoading(false);
      setOpen(false); // ปิด Dialog
      toast({
        title: "Success",
        description: "อัปโหลดรูปภาพสำเร็จ",
        status: "success",
        variant: "success",
        isClosable: true,
      });
      router.refresh(); // Refresh the page to show the new image
    } catch (error) {
      console.error("Error uploading image", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#204d9c] text-white">อัปโหลดรูปภาพ</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>เพิ่มรูปภาพ</DialogTitle>
            <DialogDescription>
              เปลี่ยนรูปภาพของแบนเนอร์ที่แสดงบนหน้าเว็บไซต์
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="images" className="text-right">
                  อัปโหลดรูปภาพ
                </Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="col-span-3"
                />
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right col-span-4">พรีวิว</Label>
                  <div className="col-span-4 flex flex-wrap gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Image Preview ${index + 1}`}
                          className="w-24 h-24 rounded-md object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                className="bg-[#204d9c] text-white"
                type="submit"
                disabled={loading}
              >
                {loading ? "กำลังอัปโหลด..." : "บันทึก"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddCarousel;
