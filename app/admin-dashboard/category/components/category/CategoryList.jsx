"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Pencil, Trash } from "lucide-react";
import Spinner from "@/components/spinner/Spinner";
import ModalAddCategory from "./ModalAddCategory";
import ModalEditCategory from "./ModalEditCategory";
import PaginationComponent from "@/components/Pagination";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const CategoryList = () => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    data: categories,
    error,
    isLoading,
    mutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/category?sort=asc`,
    fetcher
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page")) || 1;
    setCurrentPage(page);
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  if (error) return <div>Error loading categories</div>;

  const handleDelete = async () => {
    if (!deleteCategory) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${deleteCategory.categoryId}`
      );
      mutate(); // Refresh the category list
      setDeleteCategory(null); // Clear the delete category state
      setIsAlertOpen(false); // Close the alert dialog
      toast({
        title: "Success",
        description: "ลบหมวดหมู่สำเร็จ",
        status: "success",
        variant: "success",
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการลบหมวดหมู่",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
  };

  const handleDeleteClick = (category) => {
    setDeleteCategory(category);
    setIsAlertOpen(true); // Open the alert dialog
  };

  // Logic for displaying categories
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;

  const filteredCategories = categories.filter((category) => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    router.push(`?page=${pageNumber}`);
  };

  return (
    <Card className="bg-base-100 shadow-xl mb-4">
      <CardHeader>
        <CardTitle>รายการหมวดหมู่</CardTitle>
        <div className="flex items-center justify-between">
          <CardDescription>ค้นหาและจัดการหมวดหมู่ในระบบ</CardDescription>
          <div>
            <ModalAddCategory onCategoryAdded={mutate} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex justify-between">
          <div className="flex items-center">
            <Input
              placeholder="ค้นหาหมวดหมู่"
              className="w-96"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <PaginationComponent
              totalPages={Math.ceil(
                filteredCategories.length / categoriesPerPage
              )}
              currentPage={currentPage}
              onPageChange={paginate}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#ID</TableHead>
                <TableHead>รูปภาพ</TableHead>
                <TableHead>ชื่อหมวดหมู่</TableHead>
                <TableHead>ชื่อหมวดหมู่ภาษาอังกฤษ</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(currentCategories) &&
              currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <TableRow key={category.categoryId}>
                    <TableCell>{category.categoryId}</TableCell>
                    <TableCell>
                      {category.cateImg ? (
                        <Image
                          src={category.cateImg}
                          width={100}
                          height={100}
                          alt={category.cateImg}
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.nameSlug}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() => handleEditClick(category)}
                      >
                        <Pencil className="text-blue-500" />
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => handleDeleteClick(category)}
                      >
                        <Trash className="text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5" className="text-center">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {selectedCategory && (
        <ModalEditCategory
          category={selectedCategory}
          onCategoryUpdated={mutate}
        />
      )}
      <DeleteConfirmationDialog
        open={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
      />
    </Card>
  );
};

export default CategoryList;
