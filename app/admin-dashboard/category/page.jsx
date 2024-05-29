import React from "react";
import CategoryList from "@/components/admin-dashboard/category/CategoryList";
import SubCategoryList from "@/components/admin-dashboard/subcategory/SubCategoryList";
const CategoryAdmin = () => {
  return (
    <div>
     
      <CategoryList />
      <SubCategoryList />
    </div>
  );
};

export default CategoryAdmin;
