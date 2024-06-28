'use client'

import { useState } from "react";
import ProductDetail from "./ProductDetail";

const ProductDetailWrapper = ({ productId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>ดูรายละเอียด</button>
      {isOpen && <ProductDetail productId={productId} />}
    </>
  );
};

export default ProductDetailWrapper;