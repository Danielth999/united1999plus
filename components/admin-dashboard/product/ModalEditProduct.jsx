import { useState, useEffect } from "react";
import axios from "axios";

const ModalEditProduct = ({ product, onProductUpdated }) => {
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    subcategoryId: "", // เพิ่ม field สำหรับ subcategoryId
    image: null, // เพิ่ม field สำหรับไฟล์ภาพ
  });

  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (product) {
      setEditProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        subcategoryId: product.subcategory?.id || "", // กำหนดค่า subcategoryId จาก product
        image: null, // รีเซ็ตไฟล์ภาพเมื่อเปิด modal
      });
      document.getElementById("edit_product_modal").showModal();
    }
  }, [product]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/sub-category`
        );
        setSubcategories(res.data.subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    setEditProduct({ ...editProduct, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("description", editProduct.description);
    formData.append("price", editProduct.price);
    formData.append("stock", editProduct.stock);
    formData.append("subcategoryId", editProduct.subcategoryId); // เพิ่ม subcategoryId ใน formData
    if (editProduct.image) {
      formData.append("image", editProduct.image);
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${product.productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onProductUpdated(); // Refresh the product list
      document.getElementById("edit_product_modal").close(); // Close the modal
    } catch (error) {
      console.log("Error updating product:", error);
    }
  };

  return (
    <dialog id="edit_product_modal" className="modal">
      <form onSubmit={handleSubmit} className="modal-box">
        <h3 className="font-bold text-lg">แก้ไขผลิตภัณฑ์</h3>
        <input
          type="text"
          name="name"
          value={editProduct.name}
          onChange={handleChange}
          className="input input-bordered w-full my-2"
          placeholder="ชื่อผลิตภัณฑ์"
          required
        />
        <textarea
          name="description"
          value={editProduct.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full my-2"
          placeholder="รายละเอียด"
          required
        />
        <input
          type="number"
          name="price"
          value={editProduct.price}
          onChange={handleChange}
          className="input input-bordered w-full my-2"
          placeholder="ราคา"
          required
        />
        <input
          type="number"
          name="stock"
          value={editProduct.stock}
          onChange={handleChange}
          className="input input-bordered w-full my-2"
          placeholder="จำนวนสินค้า"
          required
        />
        <select
          name="subcategoryId"
          value={editProduct.subcategoryId}
          onChange={handleChange}
          className="select select-bordered w-full my-2"
          required
        >
          <option value="" disabled>
            เลือกหมวดหมู่ย่อย
          </option>
          {Array.isArray(subcategories) &&
            subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
        </select>
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="input input-bordered w-full my-2"
        />
        <div className="modal-action">
          <button type="submit" className="btn btn-primary">
            บันทึก
          </button>
          <button
            type="button"
            className="btn"
            onClick={() =>
              document.getElementById("edit_product_modal").close()
            }
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default ModalEditProduct;
