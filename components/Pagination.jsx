// components/ui/Pagination.js
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({ totalPages, currentPage, onPageChange }) => {
  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const ellipsis = <PaginationEllipsis key="ellipsis" />;
    const maxPagesToShow = 5;
    const pageBuffer = 2;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handleClick(i)}
              className={
                i === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      if (currentPage <= pageBuffer + 1) {
        for (let i = 1; i <= pageBuffer * 2 + 1; i++) {
          pageNumbers.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handleClick(i)}
                className={
                  i === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        pageNumbers.push(ellipsis);
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handleClick(totalPages)}
              className={
                totalPages === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (currentPage >= totalPages - pageBuffer) {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink
              onClick={() => handleClick(1)}
              className={
                1 === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        pageNumbers.push(ellipsis);
        for (let i = totalPages - pageBuffer * 2; i <= totalPages; i++) {
          pageNumbers.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handleClick(i)}
                className={
                  i === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink
              onClick={() => handleClick(1)}
              className={
                1 === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        pageNumbers.push(ellipsis);
        for (
          let i = currentPage - pageBuffer;
          i <= currentPage + pageBuffer;
          i++
        ) {
          pageNumbers.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handleClick(i)}
                className={
                  i === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        pageNumbers.push(ellipsis);
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handleClick(totalPages)}
              className={
                totalPages === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handleClick(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            onClick={() => handleClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
