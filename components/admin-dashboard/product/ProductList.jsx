"use client";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Trash } from "lucide-react";
import Spinner from "../../spinner/Spinner";
import ModalAddProduct from "./ModalAddProduct";
import ModalEditProduct from "./ModalEditProduct";
import Pagination from "../../Pagination";
import Image from "next/image";
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

const ProductList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`
      );
      setProducts(res.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
      );
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
  };

  // Logic for displaying products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    router.push(`?page=${pageNumber}`);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <Suspense fallback={<Spinner />}>
          <Card className="bg-base-100 shadow-xl">
            <CardHeader>
              <CardTitle>รายการผลิตภัณฑ์</CardTitle>
              <CardDescription>ค้นหาและจัดการผลิตภัณฑ์ในระบบ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between">
                <Input
                  placeholder="ค้นหาผลิตภัณฑ์"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ModalAddProduct onProductAdded={fetchProducts} />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#ID</TableHead>
                      <TableHead>รูปภาพ</TableHead>
                      <TableHead>ชื่อผลิตภัณฑ์</TableHead>
                      <TableHead>รายละเอียด</TableHead>
                      <TableHead>ราคา</TableHead>
                      <TableHead>จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProducts.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell>{product.productId}</TableCell>
                        <TableCell>
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              width={100}
                              height={100}
                              alt={product.name}
                            />
                          ) : (
                            <span>No Image</span>
                          )}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.price.toFixed(2)} บาท</TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            onClick={() => handleEditClick(product)}
                          >
                            <Pencil className="text-blue-500" />
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => handleDelete(product.productId)}
                          >
                            <Trash className="text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center mt-4">
              <Pagination
                totalPages={Math.ceil(
                  filteredProducts.length / productsPerPage
                )}
                currentPage={currentPage}
                onPageChange={paginate}
              />
            </CardFooter>
          </Card>
        </Suspense>
      )}
      {selectedProduct && (
        <ModalEditProduct
          product={selectedProduct}
          onProductUpdated={fetchProducts}
        />
      )}
    </>
  );
};

export default ProductList;
