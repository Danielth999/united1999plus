import { useState, useEffect } from "react";
import axios from "axios";

const ModalEditProduct = ({ product, onProductUpdated }) => {
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
  });

  useEffect(() => {
    if (product) {
      setEditProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      });
      document.getElementById("edit_product_modal").showModal();
    }
  }, [product]);

  const handleChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${product.productId}`, editProduct);
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
        <input type="text" name="name" value={editProduct.name} onChange={handleChange} className="input input-bordered w-full my-2" placeholder="ชื่อผลิตภัณฑ์" required />
        <textarea name="description" value={editProduct.description} onChange={handleChange} className="textarea textarea-bordered w-full my-2" placeholder="รายละเอียด" required />
        <input type="number" name="price" value={editProduct.price} onChange={handleChange} className="input input-bordered w-full my-2" placeholder="ราคา" required />
        <input type="number" name="stock" value={editProduct.stock} onChange={handleChange} className="input input-bordered w-full my-2" placeholder="จำนวนสินค้า" required />
        <div className="modal-action">
          <button type="submit" className="btn btn-primary">บันทึก</button>
          <button type="button" className="btn" onClick={() => document.getElementById("edit_product_modal").close()}>ยกเลิก</button>
        </div>
      </form>
    </dialog>
  );
};

export default ModalEditProduct;
