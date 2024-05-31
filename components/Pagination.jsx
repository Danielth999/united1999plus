import React from "react";
import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // Helper function to handle conditional class names

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const router = useRouter();
  const pages = [];

  const handlePageChange = (page) => {
    onPageChange(page);
    router.push(`?page=${page}`);
  };

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <PaginationItem key={i}>
        <PaginationLink
          href="#"
          onClick={() => handlePageChange(i)}
          className={cn({ "bg-blue-500 text-white": i === currentPage })}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <ShadPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>
        {pages.length > 7 && currentPage > 4 && (
          <>
            <PaginationItem>
              <PaginationLink href="#" onClick={() => handlePageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationEllipsis />
          </>
        )}
        {pages.slice(
          currentPage > 4 ? currentPage - 4 : 0,
          currentPage > 4 ? currentPage + 3 : 7
        )}
        {pages.length > 7 && currentPage < totalPages - 3 && (
          <>
            <PaginationEllipsis />
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
};

export default Pagination;
