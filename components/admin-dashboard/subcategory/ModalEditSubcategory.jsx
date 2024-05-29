import { useState, useEffect } from "react";
import axios from "axios";

const ModalEditSubcategory = ({ subcategory, onSubcategoryUpdated }) => {
  const [updatedSubcategory, setUpdatedSubcategory] = useState({
    name: subcategory.name,
    categoryId: subcategory.categoryId,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/category`);
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        throw new Error("Fetched data is not in the expected format");
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setUpdatedSubcategory({ ...updatedSubcategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subcategory/${subcategory.subcategoryId}`,
        updatedSubcategory
      );
      if (response.status === 200) {
        onSubcategoryUpdated(); // Fetch subcategories again to update the list
        document.getElementById("edit_subcategory_modal").close(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      setError("Failed to update subcategory. Please try again.");
    }
  };

  return (
    <>
      <dialog
        id="edit_subcategory_modal"
        className="modal modal-bottom sm:modal-middle"
        open
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">แก้ไขหมวดหมู่ย่อย</h3>
          <p className="py-4">
            {error || "กด ESC หรือปุ่มปิดเพื่อปิดหน้าต่าง"}
          </p>
          <form onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-2 mb-2">
              <input
                type="text"
                name="name"
                value={updatedSubcategory.name}
                onChange={handleChange}
                className="grow"
                placeholder="ชื่อหมวดหมู่ย่อย"
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 mb-2">
              <select
                name="categoryId"
                value={updatedSubcategory.categoryId}
                onChange={handleChange}
                className="grow"
                required
              >
                <option value="">เลือกหมวดหมู่หลัก</option>
                {categories.map((cate) => (
                  <option key={cate.categoryId} value={cate.categoryId}>
                    {cate.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end">
              <button type="submit" className="btn text-white bg-[#204d9c]">
                บันทึก
              </button>
              <button
                type="button"
                className="btn btn-error text-white"
                onClick={() =>
                  document.getElementById("edit_subcategory_modal").close()
                }
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ModalEditSubcategory;
