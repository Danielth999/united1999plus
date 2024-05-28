// ProductList.js
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import Spinner from "../../spinner/Spinner";
import ModalAddProduct from "./ModalAddProduct";
import ModalEditProduct from "./ModalEditProduct";
import Pagination from "./Pagination-PD";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`
      );
      if (res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        throw new Error("Fetched data is not in the expected format");
      }
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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <div className="mb-2 flex justify-between">
                <input
                  className="input input-bordered"
                  placeholder="ค้นหาผลิตภัณฑ์"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ModalAddProduct onProductAdded={fetchProducts} />
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>ชื่อผลิตภัณฑ์</th>
                    <th>รายละเอียด</th>
                    <th>ราคา</th>
                    <th>จำนวนสินค้า</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.price.toFixed(2)} บาท</td>
                      <td>{product.stock}</td>
                      <td>
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-500"
                        >
                          <Pencil />
                        </button>
                        <button
                          onClick={() => handleDelete(product.productId)}
                          className="text-red-500"
                        >
                          <Trash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>#ID</th>
                    <th>ชื่อผลิตภัณฑ์</th>
                    <th>รายละเอียด</th>
                    <th>ราคา</th>
                    <th>จำนวนสินค้า</th>
                    <th>จัดการ</th>
                  </tr>
                </tfoot>
              </table>
              <Pagination
                itemsPerPage={productsPerPage}
                totalItems={filteredProducts.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
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
