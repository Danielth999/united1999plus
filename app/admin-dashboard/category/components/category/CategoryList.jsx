"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import Spinner from "@/components/spinner/Spinner";
import ModalAddCategory from "./ModalAddCategory";
import ModalEditCategory from "./ModalEditCategory";
import Pagination from "@/components/Pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category?sort=${sortOrder}`
      );

      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        throw new Error("Fetched data is not in the expected format");
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [sortOrder]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/${id}`
      );
      fetchCategories(); // Fetch categories again to update the list
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
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
                <div>
                  <Button variatn="blue" onClick={handleSort}>
                    {sortOrder === "asc"
                      ? "เรียงลำดับตาม ID (น้อยไปมาก)"
                      : "เรียงลำดับตาม ID (มากไปน้อย)"}
                  </Button>
                </div>
              </div>
              <div>
                <Pagination
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
                            onClick={() => handleDelete(category.categoryId)}
                          >
                            <Trash className="text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="4" className="text-center">
                        No categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      {selectedCategory && (
        <ModalEditCategory
          category={selectedCategory}
          onCategoryUpdated={fetchCategories}
        />
      )}
    </>
  );
};

export default CategoryList;
