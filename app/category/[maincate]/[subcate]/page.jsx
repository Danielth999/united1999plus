// app/category/foodpackaging/[path]/page.jsx
"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const { subcate } = useParams();

  return <p>Post: {subcate}</p>;
}
