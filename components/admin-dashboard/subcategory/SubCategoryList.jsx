"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import Spinner from "../../spinner/Spinner";
import ModalAddSubcategory from "./ModalAddSubcategory";
import ModalEditSubcategory from "./ModalEditSubcategory";

const SubCategoryList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [subcategoriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const fetchSubcategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sub-category`
      );

      if (res.data && Array.isArray(res.data)) {
        setSubcategories(res.data);
      } else {
        throw new Error("Fetched data is not in the expected format");
      }
    } catch (error) {
      console.log("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sub-category/${id}`
      );
      fetchSubcategories(); // Fetch subcategories again to update the list
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  const handleEditClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  // Logic for displaying subcategories
  const indexOfLastSubcategory = currentPage * subcategoriesPerPage;
  const indexOfFirstSubcategory = indexOfLastSubcategory - subcategoriesPerPage;

  const filteredSubcategories = subcategories.filter((subcategory) => {
    return subcategory.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentSubcategories = filteredSubcategories.slice(
    indexOfFirstSubcategory,
    indexOfLastSubcategory
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
                  <ModalAddSubcategory onSubcategoryAdded={fetchSubcategories} />
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>ชื่อหมวดหมู่ย่อย</th>
                    <th>ชื่อหมวดหมู่หลัก</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(currentSubcategories) &&
                  currentSubcategories.length > 0 ? (
                    currentSubcategories.map((subcategory) => (
                      <tr className="hover" key={subcategory.subcategoryId}>
                        <th>{subcategory.subcategoryId}</th>
                        <td>{subcategory.name}</td>
                        <td>{subcategory.category.name}</td>
                        <td>
                          <button
                            onClick={() => handleEditClick(subcategory)}
                            className="text-blue-500"
                          >
                            <Pencil />
                          </button>
                          <button
                            onClick={() => handleDelete(subcategory.subcategoryId)}
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
                        No subcategories found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th>#ID</th>
                    <th>ชื่อหมวดหมู่ย่อย</th>
                    <th>ชื่อหมวดหมู่หลัก</th>
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
                          filteredSubcategories.length / subcategoriesPerPage
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
      {selectedSubcategory && (
        <ModalEditSubcategory
          subcategory={selectedSubcategory}
          onSubcategoryUpdated={fetchSubcategories}
        />
      )}
    </>
  );
};

export default SubCategoryList;
