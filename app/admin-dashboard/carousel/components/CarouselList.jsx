"use client";
import React, { useState, Suspense } from "react";
import useSWR from "swr";
import axios from "axios";
import { Trash } from "lucide-react";
import Image from "next/image";
import AddCarousel from "./AddCarousel";
import { useToast } from "@/components/ui/use-toast";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import Spinner from "@/components/spinner/Spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const CarouselListContent = () => {
  const { data, error, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/carousel`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 1000,
    }
  );

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteMultiple, setDeleteMultiple] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isSingleDeleteDialogOpen, setIsSingleDeleteDialogOpen] =
    useState(false);

  const handleCheckboxChange = (imageId) => {
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(imageId)) {
        return prevSelectedImages.filter((id) => id !== imageId);
      } else {
        return [...prevSelectedImages, imageId];
      }
    });
  };

  const openDeleteDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDialogOpen(false);
    setSelectedImages([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) return;

    const optimisticData = data.filter(
      (image) => !selectedImages.includes(image.id)
    );

    mutate(optimisticData, false);

    setLoading(true);
    try {
      await Promise.all(
        selectedImages.map((imageId) =>
          axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/carousel/${imageId}`
          )
        )
      );
      toast({
        title: "Success",
        description: "ลบรูปภาพสำเร็จ",
        status: "success",
        variant: "success",
        isClosable: true,
      });
      mutate(); // Revalidate the cache
    } catch (error) {
      console.error("Error deleting images", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการลบรูปภาพ",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
      mutate(); // Revalidate the cache
    } finally {
      setLoading(false);
      closeDeleteDialog(); // Reset and close the dialog
    }
  };

  const openSingleDeleteDialog = (imageId) => {
    setImageToDelete(imageId);
    setIsSingleDeleteDialogOpen(true);
  };

  const closeSingleDeleteDialog = () => {
    setImageToDelete(null);
    setIsSingleDeleteDialogOpen(false);
  };

  const handleDeleteSingleImage = async () => {
    if (!imageToDelete) return;

    const optimisticData = data.filter((image) => image.id !== imageToDelete);

    mutate(optimisticData, false);

    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/carousel/${imageToDelete}`
      );
      toast({
        title: "Success",
        description: "ลบรูปภาพสำเร็จ",
        status: "success",
        variant: "success",
        isClosable: true,
      });
      mutate(); // Revalidate the cache
    } catch (error) {
      console.error("Error deleting image", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการลบรูปภาพ",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
      mutate(); // Revalidate the cache
    } finally {
      setLoading(false);
      closeSingleDeleteDialog(); // Reset and close the dialog
    }
  };

  const handlePublishToggle = async (imageId, currentStatus) => {
    const optimisticData = data.map((image) =>
      image.id === imageId ? { ...image, isPublished: !currentStatus } : image
    );

    mutate(optimisticData, false);

    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/carousel/${imageId}`,
        { isPublished: !currentStatus }
      );
      toast({
        title: "Success",
        description: "เปลี่ยนสถานะการเผยแพร่สำเร็จ",
        status: "success",
        variant: "success",
        isClosable: true,
      });
      mutate(); // Revalidate the cache
    } catch (error) {
      console.error("Error toggling publish status", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะการเผยแพร่",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
      mutate(); // Revalidate the cache
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>Error fetching carousel images</div>;
  }

  return (
    <Card className="bg-base-100 shadow-xl">
      <CardHeader>
        <CardTitle>รูปภาพในแบบเนอร์</CardTitle>
        <div className="flex justify-between items-center">
          <CardDescription>จัดการรูปภาพในแบบเนอร์ของคุณ</CardDescription>
          <AddCarousel onUpload={() => mutate()} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedImages(data.map((image) => image.id));
                      } else {
                        setSelectedImages([]);
                      }
                    }}
                    checked={
                      Array.isArray(data) &&
                      selectedImages.length === data.length &&
                      data.length > 0
                    }
                  />
                </TableHead>
                <TableHead>#</TableHead>
                <TableHead>รูปภาพ</TableHead>
                <TableHead>เผยแพร่</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((image, index) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(image.id)}
                        checked={selectedImages.includes(image.id)}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Image
                        src={image.url}
                        alt={`Carousel Image ${index + 1}`}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={image.isPublished}
                        onCheckedChange={() =>
                          handlePublishToggle(image.id, image.isPublished)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() => openSingleDeleteDialog(image.id)}
                        disabled={loading}
                      >
                        <Trash className="text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="4" className="text-center py-4">
                    ไม่พบรูปภาพ
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {selectedImages.length > 0 && (
        <CardFooter className="flex justify-between items-center">
          <span>{selectedImages.length} รายการที่เลือก</span>
          <Button variant="destructive" onClick={openDeleteDialog}>
            ลบรายการที่เลือก
          </Button>
        </CardFooter>
      )}
      <DeleteConfirmationDialog
        open={isDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteSelected}
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedImages.length} รายการนี้?`}
      />
      <DeleteConfirmationDialog
        open={isSingleDeleteDialogOpen}
        onClose={closeSingleDeleteDialog}
        onConfirm={handleDeleteSingleImage}
        message="คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?"
      />
    </Card>
  );
};

const CarouselList = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <CarouselListContent />
    </Suspense>
  );
};

export default CarouselList;
