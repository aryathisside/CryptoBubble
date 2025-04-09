import React from 'react'
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";

const SubPagination = ({currentPage, itemsPerPage, setCurrentPage, totalItems}) => {
    const pageRange = 2;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    
const generatePageNumbers = () => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    if (totalPages <= 1) return [1];
  
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };
  
    
    const handlePageClick = (pageNumber) => {
      if (pageNumber !== "...") {
        setCurrentPage(pageNumber);
      }
    };
  return (

            <Pagination className="text-sm justify-center">
        <Pagination.First onClick={() => handlePageClick(1)} />
        <Pagination.Prev
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {generatePageNumbers()
          .filter((page) => {
            return (
              page === 1 ||
              page === totalPages ||
              page === currentPage ||
              (page >= currentPage - pageRange &&
                page <= currentPage + pageRange)
            );
          })
          .map((page, index) => (
            <Pagination.Item
              key={index}
              active={page === currentPage}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </Pagination.Item>
          ))}
        <Pagination.Next
          onClick={() => handlePageClick(Number(currentPage) + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last onClick={() => handlePageClick(totalPages)} />
      </Pagination>

  )
}

export default SubPagination
