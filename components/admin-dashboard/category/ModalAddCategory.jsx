import { useState } from "react";
import axios from "axios";

const ModalAddCategory = ({ onCategoryAdded }) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
   
  });

  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`,
        newCategory
      );
      onCategoryAdded(); // Fetch categories again to update the list
      document.getElementById("add_category_modal").close(); // Close the modal
      setNewCategory({ name: "", nameSlug: "" }); // Reset form
    } catch (error) {
      console.log("Error adding category:", error);
    }
  };

  return (
    <>
      <button
        className="btn bg-[#204d9c] text-white"
        onClick={() =>
          document.getElementById("add_category_modal").showModal()
        }
      >
        เพิ่มหมวดหมู่
      </button>
      <dialog
        id="add_category_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">เพิ่มหมวดหมู่</h3>
          <p className="py-4">กด ESC หรือปุ่มปิดเพื่อปิดหน้าต่าง</p>
          <div className="modal-action block justify-center">
            <form onSubmit={handleSubmit}>
              <label className="input input-bordered flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleChange}
                  className="grow"
                  placeholder="ชื่อหมวดหมู่"
                  required
                />
              </label>
              <label className="input input-bordered flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  name="nameSlug"
                  value={newCategory.nameSlug}
                  onChange={handleChange}
                  className="grow"
                  placeholder="ชื่อหมวดหมู่ภาษาอังกฤษ"
                  required
                />
              </label>
              <div className="flex justify-end">
                <button type="submit" className="btn text-white bg-[#204d9c]">
                  บันทึก
                </button>
                <button
                  type="button"
                  className="btn btn-error text-white"
                  onClick={() =>
                    document.getElementById("add_category_modal").close()
                  }
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalAddCategory;
