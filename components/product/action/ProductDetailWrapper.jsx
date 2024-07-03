"use client";

import { useState } from "react";
import ProductDetail from "./ProductDetail";

export default function ProductDetailWrapper({ children, productId }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      {isOpen && (
        <ProductDetail
          productId={productId}
          open={isOpen}
          setOpen={setIsOpen}
        />
      )}
    </>
  );
}
