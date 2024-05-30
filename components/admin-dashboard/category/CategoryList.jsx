"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import Spinner from "../../spinner/Spinner";
import ModalAddCategory from "./ModalAddCategory";
import ModalEditCategory from "./ModalEditCategory";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`
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
  }, []);

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
        <div className="card bg-base-100 shadow-xl mb-4">
          <div className="card-body">
            <div className="overflow-x-auto">
              <div className="mb-2 flex justify-between">
                <div className="join">
                  <input
                    className="input input-bordered join-item"
                    placeholder="ค้นหา"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="indicator">
                    <button className="btn bg-[#204d9c] text-white join-item">
                      ค้นหา
                    </button>
                  </div>
                </div>
                <div>
                  <ModalAddCategory onCategoryAdded={fetchCategories} />
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>ชื่อหมวดหมู่</th>
                    <th>ชื่อหมวดหมู่ภาษาอังกฤษ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(currentCategories) &&
                  currentCategories.length > 0 ? (
                    currentCategories.map((category) => (
                      <tr className="hover" key={category.categoryId}>
                        <th>{category.categoryId}</th>
                        <td>{category.name}</td>
                        <td>{category.nameSlug}</td>
                        <td>
                          <button
                            onClick={() => handleEditClick(category)}
                            className="text-blue-500"
                          >
                            <Pencil />
                          </button>
                          <button
                            onClick={() => handleDelete(category.categoryId)}
                            className="text-red-500"
                          >
                            <Trash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th>#ID</th>
                    <th>ชื่อหมวดหมู่</th>
                    <th>หมวดหมู่ย่อย</th>
                    <th>จัดการ</th>
                  </tr>
                </tfoot>
              </table>
              <div className="flex justify-center mt-4">
                <nav>
                  <ul className="pagination">
                    {Array.from(
                      {
                        length: Math.ceil(
                          filteredCategories.length / categoriesPerPage
                        ),
                      },
                      (_, i) => (
                        <li key={i} className="page-item">
                          <button
                            onClick={() => paginate(i + 1)}
                            className="page-link"
                          >
                            {i + 1}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
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
