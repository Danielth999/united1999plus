"use client";
import { useState, Suspense } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Pencil, Trash } from "lucide-react";
import Spinner from "@/components/spinner/Spinner";
import ModalAddProduct from "./ModalAddProduct";
import ModalEditProduct from "./ModalEditProduct";
import Pagination from "@/components/Pagination";
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
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const ProductListContent = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const {
    data: products,
    error,
    mutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, fetcher);

  if (error) {
    return <div>Error fetching products</div>;
  }

  if (!products) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // ตรวจสอบว่า products เป็น array หรือไม่
  const productList = Array.isArray(products) ? products : [];

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${deleteProduct.productId}`
      );
      mutate(); // Refresh the product list
      setDeleteProduct(null); // Clear the delete product stateF
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
  };

  const handleDeleteClick = (product) => {
    setDeleteProduct(product);
  };

  // Logic for displaying products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const filteredProducts = productList.filter(
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
      <Card className="bg-base-100 shadow-xl">
        <CardHeader>
          <CardTitle>รายการผลิตภัณฑ์</CardTitle>
          <div className="flex justify-between items-center">
            <CardDescription>ค้นหาและจัดการผลิตภัณฑ์ในระบบ</CardDescription>
            <ModalAddProduct onProductAdded={mutate} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between">
            <Input
              placeholder="ค้นหาผลิตภัณฑ์"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full "
            />
            <div>
              <Pagination
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
                  <TableHead>#</TableHead>
                  <TableHead>รูปภาพ</TableHead>
                  <TableHead>ชื่อผลิตภัณฑ์</TableHead>
                  <TableHead>รายละเอียด</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead>ราคา</TableHead>
                  <TableHead>จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.productId}>
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
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.Category.name}</TableCell>
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
                        onClick={() => handleDeleteClick(product)}
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
      </Card>
      {selectedProduct && (
        <ModalEditProduct product={selectedProduct} onProductUpdated={mutate} />
      )}
      <DeleteConfirmationDialog
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
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
