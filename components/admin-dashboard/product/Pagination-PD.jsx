// Pagination.js
import React from "react";

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center space-x-1">
      <button
        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
        className="btn bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
      >
        «
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`btn ${
            currentPage === number ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => paginate(currentPage < pageNumbers.length ? currentPage + 1 : pageNumbers.length)}
        className="btn bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
