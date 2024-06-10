"use client";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Pencil, Trash, Eye } from "lucide-react";
import Spinner from "@/components/spinner/Spinner";
import ModalAddProduct from "./ModalAddProduct";
import ModalEditProduct from "./ModalEditProduct";
import PaginationComponent from "@/components/Pagination";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

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
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { useToast } from "@/components/ui/use-toast";

const ProductListContent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(""); // สำหรับการกรองตามหมวดหมู่
  const [publishFilter, setPublishFilter] = useState(""); // สำหรับการกรองตามสถานะการเผยแพร่
  const [categories, setCategories] = useState([]); // เก็บข้อมูลหมวดหมู่
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteMultiple, setDeleteMultiple] = useState(false); // สำหรับจัดการ dialog การลบหลายรายการ

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`
      );
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-red-500">เกิดข้อผิดพลาดในการแสดงผลข้อมูลสินค้า</h1>
      </div>
    );
  }

  const productList = Array.isArray(products) ? products : [];

  const handleDelete = async () => {
    if (!deleteProduct) return;
    const startTime = performance.now();

    const optimisticProducts = products.filter(
      (product) => product.productId !== deleteProduct.productId
    );
    setProducts(optimisticProducts); // Optimistically update UI

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${deleteProduct.productId}`
      );
      const endTime = performance.now();
      const deleteDuration = ((endTime - startTime) / 1000).toFixed(2); // แปลงเป็นวินาที
      toast({
        title: "ลบสำเร็จ",
        description: `เวลาในการลบ: ${deleteDuration} วินาที`,
        variant: "success",
        status: "success",
      });
    } catch (error) {
      setProducts(products); // Revert UI update on error
      console.error("Error deleting product:", error);
      toast({
        title: "ลบไม่สำเร็จ",
        description: "เกิดข้อผิดพลาดในการลบ",
        variant: "destructive",
        status: "error",
      });
    } finally {
      setDeleteProduct(null); // Clear the delete product state
    }
  };

  const handleDeleteSelected = async () => {
    const startTime = performance.now();

    const optimisticProducts = products.filter(
      (product) => !selectedProducts.includes(product.productId)
    );
    setProducts(optimisticProducts); // Optimistically update UI

    try {
      await Promise.all(
        selectedProducts.map((productId) =>
          axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`
          )
        )
      );
      const endTime = performance.now();
      const deleteDuration = ((endTime - startTime) / 1000).toFixed(2); // แปลงเป็นวินาที
      toast({
        title: "ลบรายการที่เลือกสำเร็จ",
        description: `เวลาในการลบ: ${deleteDuration} วินาที`,
        variant: "success",
        status: "success",
      });
      setSelectedProducts([]); // Clear selected products state
    } catch (error) {
      setProducts(products); // Revert UI update on error
      console.error("Error deleting selected products:", error);
      toast({
        title: "ลบรายการที่เลือกไม่สำเร็จ",
        description: "เกิดข้อผิดพลาดในการลบ",
        variant: "destructive",
        status: "error",
      });
    } finally {
      setDeleteMultiple(false);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
  };

  const handleDeleteClick = (product) => {
    setDeleteProduct(product);
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts.includes(productId)) {
        return prevSelectedProducts.filter((id) => id !== productId);
      } else {
        return [...prevSelectedProducts, productId];
      }
    });
  };

  const handlePublishToggle = async (productId, currentStatus) => {
    const updatedProducts = products.map((product) =>
      product.productId === productId
        ? { ...product, isPublished: !currentStatus }
        : product
    );

    setProducts(updatedProducts); // Update UI optimistically

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        { isPublished: !currentStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      toast({
        title: "Success",
        description: `เปลี่ยนสถานะการเผยแพร่สำเร็จ`,
        status: "success",
        variant: "success",
        isClosable: true,
      });
    } catch (error) {
      // Revert the change in case of an error
      setProducts(products);

      console.error("Error toggling publish status:", error);
      toast({
        title: "Error",
        description: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะการเผยแพร่",
        status: "error",
        variant: "destructive",
        isClosable: true,
      });
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const filteredProducts = productList.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "" || product.categoryId === parseInt(categoryFilter)) &&
      (publishFilter === "" || (publishFilter === "published" && product.isPublished) || (publishFilter === "unpublished" && !product.isPublished))
  );

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    router.push(`?page=${pageNumber}`);
  };

  return (
    <>
      <Card className="bg-base-100 shadow-xl">
        <CardHeader>
          <CardTitle>รายการผลิตภัณฑ์</CardTitle>
          <div className="flex justify-between items-center">
            <CardDescription>ค้นหาและจัดการผลิตภัณฑ์ในระบบ</CardDescription>
            <ModalAddProduct onProductAdded={fetchProducts} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between items-center">
            <Input
              placeholder="ค้นหาผลิตภัณฑ์"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="ml-2 p-2 border rounded"
            >
              <option value="">ทั้งหมด</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={publishFilter}
              onChange={(e) => setPublishFilter(e.target.value)}
              className="ml-2 p-2 border rounded"
            >
              <option value="">ทั้งหมด</option>
              <option value="published">เผยแพร่</option>
              <option value="unpublished">ไม่เผยแพร่</option>
            </select>
            <div className="ml-2">
              <PaginationComponent
                totalPages={Math.ceil(
                  filteredProducts.length / productsPerPage
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
                          setSelectedProducts(
                            currentProducts.map((p) => p.productId)
                          );
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                      checked={
                        selectedProducts.length === currentProducts.length &&
                        currentProducts.length > 0
                      }
                    />
                  </TableHead>
                  <TableHead>#</TableHead>
                  <TableHead>รูปภาพ</TableHead>
                  <TableHead>ชื่อผลิตภัณฑ์</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead>ราคา</TableHead>
                  <TableHead>เผยแพร่</TableHead>
                  <TableHead>จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(product.productId)}
                        checked={selectedProducts.includes(product.productId)}
                      />
                    </TableCell>
                    <TableCell>
                      {filteredProducts.indexOf(product) + 1}
                    </TableCell>
                    <TableCell>
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          width={100}
                          height={100}
                          alt={product.name}
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.Category.name}</TableCell>
                    <TableCell>{product.price.toFixed(2)} บาท</TableCell>
                    <TableCell>
                      <Switch
                        checked={product.isPublished}
                        onCheckedChange={() =>
                          handlePublishToggle(
                            product.productId,
                            product.isPublished
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() => handleEditClick(product)}
                      >
                        <Pencil className="text-blue-500" />
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash className="text-red-500" />
                      </Button>
                      <Button
                        variant="link"
                        onClick={() =>
                          router.push(
                            `/admin-dashboard/products/${product.productId}`
                          )
                        }
                      >
                        <Eye className="text-green-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {selectedProducts.length > 0 && (
          <CardFooter className="flex justify-between items-center">
            <span>{selectedProducts.length} รายการที่เลือก</span>
            <Button
              variant="destructive"
              onClick={() => setDeleteMultiple(true)}
            >
              ลบรายการที่เลือก
            </Button>
          </CardFooter>
        )}
      </Card>
      {selectedProduct && (
        <ModalEditProduct
          product={selectedProduct}
          onProductUpdated={fetchProducts}
        />
      )}
      <DeleteConfirmationDialog
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
      />
      <DeleteConfirmationDialog
        open={deleteMultiple}
        onClose={() => setDeleteMultiple(false)}
        onConfirm={handleDeleteSelected}
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedProducts.length} รายการนี้?`}
      />
    </>
  );
};

const ProductList = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ProductListContent />
    </Suspense>
  );
};

export default ProductList;
