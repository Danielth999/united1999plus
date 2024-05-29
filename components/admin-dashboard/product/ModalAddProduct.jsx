'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';

const ModalAddProduct = ({ onProductAdded }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    subcategoryId: '',
    image: null,
  });

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/sub-category');
      setSubcategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('subcategoryId', formData.subcategoryId);
    data.append('image', formData.image);

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onProductAdded(response.data);
      document.getElementById('add_product_modal').close();
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => document.getElementById('add_product_modal').showModal()}
        className="btn bg-[#204d9c] text-white"
      >
        เพิ่มสินค้าใหม่
      </button>
      <dialog id="add_product_modal" className="modal">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="modal-box p-5">
          <h3 className="font-bold text-lg mb-4">เพิ่มสินค้าใหม่</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full mb-3"
            placeholder="Product Name"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full mb-3"
            placeholder="Description"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input input-bordered w-full mb-3"
            placeholder="Price"
            required
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="input input-bordered w-full mb-3"
            placeholder="Stock"
            required
          />
          <select
            name="subcategoryId"
            value={formData.subcategoryId}
            onChange={handleChange}
            className="select select-bordered w-full mb-3"
            required
          >
            <option value="">เลือกหมวดหมู่ย่อย</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                {subcategory.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full mb-3"
          />
          <div className="modal-action">
            <button type="submit" className="btn bg-[#204d9c] text-white">
              บันทึก
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('add_product_modal').close()}
              className="btn text-white btn-error"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default ModalAddProduct;
