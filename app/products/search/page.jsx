"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const encodedQuery = encodeURI(searchQuery || "");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodedQuery}`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setIsLoading(false);
      }
    };

    if (encodedQuery) {
      fetchProducts();
    }
  }, [encodedQuery]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Search Results for "{searchQuery}"</h1>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default SearchPage;
