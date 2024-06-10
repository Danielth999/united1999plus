"use client";
import { useState, useEffect } from "react";
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
  CardFooter,
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

const CategoryList = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteMultiple, setDeleteMultiple] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`
      );
      setCategories(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

    const optimisticCategories = categories.filter(
      (cat) => cat.categoryId !== deleteCategory.categoryId
    );
    setCategories(optimisticCategories); // Update UI optimistically
    setDeleteCategory(null); // Clear the delete category state
    setIsAlertOpen(false); // Close the alert dialog
    toast({
      title: "Success",
      description: "ลบหมวดหมู่สำเร็จ",
      status: "success",
      variant: "success",
      isClosable: true,
    });

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${deleteCategory.categoryId}`
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการลบหมวดหมู่",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
      // Revert the change in case of an error
      setCategories(categories);
    }
  };

  const handleDeleteSelected = async () => {
    const optimisticCategories = categories.filter(
      (cat) => !selectedCategories.includes(cat.categoryId)
    );
    setCategories(optimisticCategories); // Update UI optimistically
    setSelectedCategories([]); // Clear selected categories state
    setDeleteMultiple(false);

    try {
      await Promise.all(
        selectedCategories.map((categoryId) =>
          axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryId}`
          )
        )
      );

      toast({
        title: "ลบรายการที่เลือกสำเร็จ",
        description: `ลบรายการที่เลือกสำเร็จ`,
        variant: "success",
        status: "success",
      });
    } catch (error) {
      console.error("Error deleting selected categories:", error);
      toast({
        title: "ลบรายการที่เลือกไม่สำเร็จ",
        description: "เกิดข้อผิดพลาดในการลบ",
        variant: "destructive",
        status: "error",
      });
      // Revert the change in case of an error
      setCategories(categories);
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
  };

  const handleDeleteClick = (category) => {
    setDeleteCategory(category);
    setIsAlertOpen(true); // Open the alert dialog
  };

  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(categoryId)) {
        return prevSelectedCategories.filter((id) => id !== categoryId);
      } else {
        return [...prevSelectedCategories, categoryId];
      }
    });
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
            <ModalAddCategory onCategoryAdded={fetchCategories} />
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
                <TableHead>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories(
                          currentCategories.map((c) => c.categoryId)
                        );
                      } else {
                        setSelectedCategories([]);
                      }
                    }}
                    checked={
                      selectedCategories.length === currentCategories.length &&
                      currentCategories.length > 0
                    }
                  />
                </TableHead>
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
                    <TableCell>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckboxChange(category.categoryId)
                        }
                        checked={selectedCategories.includes(
                          category.categoryId
                        )}
                      />
                    </TableCell>
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
                  <TableCell colSpan="6" className="text-center">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {selectedCategories.length > 0 && (
        <CardFooter className="flex justify-between items-center">
          <span>{selectedCategories.length} รายการที่เลือก</span>
          <Button
            variant="destructive"
            onClick={() => setDeleteMultiple(true)}
          >
            ลบรายการที่เลือก
          </Button>
        </CardFooter>
      )}
      {selectedCategory && (
        <ModalEditCategory
          category={selectedCategory}
          onCategoryUpdated={fetchCategories}
        />
      )}
      <DeleteConfirmationDialog
        open={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
      />
      <DeleteConfirmationDialog
        open={deleteMultiple}
        onClose={() => setDeleteMultiple(false)}
        onConfirm={handleDeleteSelected}
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedCategories.length} รายการนี้?`}
      />
    </Card>
  );
};

export default CategoryList;
