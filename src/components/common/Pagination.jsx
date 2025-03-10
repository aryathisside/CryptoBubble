import React, { useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";

const DynamicPagination = ({ currentPage, itemsPerPage, setCurrentPage, totalItems }) => {
  const pageRange = 2;
  const [jumpPage, setJumpPage] = useState("");
//   const items = itemsPerPage;
const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
console.log("Pagination Props:", { totalItems, itemsPerPage, currentPage, totalPages });



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

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    setJumpPage("");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 text-white rounded-lg">
      <div className="text-sm">
        Showing <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
        {Math.min(currentPage * itemsPerPage, totalItems)}</strong> of <strong>{totalItems}</strong> items
      </div>

      
      <Pagination className="txt-14">
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

      <div className="flex items-center space-x-2">
        <span>Jump to:</span>
        <input type="number" className="w-16 px-2 py-1 text-white bg-[#171A24] rounded-md border-2 border-[#2A2E36]" 
          value={jumpPage} 
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJumpToPage()}
        />
        {/* <button className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600" onClick={handleJumpToPage}>Go</button> */}
      </div>
    </div>
  );
};

export default DynamicPagination;
