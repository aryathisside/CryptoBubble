import React, { useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import SubPagination from "./SubPagination";

const DynamicPagination = ({ currentPage, itemsPerPage, setCurrentPage, totalItems }) => {
  const pageRange = 2;
  const [jumpPage, setJumpPage] = useState("");
//   const items = itemsPerPage;
const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
// console.log("Pagination Props:", { totalItems, itemsPerPage, currentPage, totalPages });




  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    setJumpPage("");
  };

  return (
    <div>
      <div className="block lg:hidden">
         <SubPagination currentPage={currentPage} totalItems={totalItems} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} />   
         </div>
    
    <div className="flex flex-row justify-between items-center gap-4 md:p-4 text-white rounded-lg">
      <div className="text-sm">
        Showing <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
        {Math.min(currentPage * itemsPerPage, totalItems)}</strong> of <strong>{totalItems}</strong>
      </div>

  <div className="hidden lg:block">
         <SubPagination currentPage={currentPage} totalItems={totalItems} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} />   
         </div>

      <div className="flex items-center space-x-2 text-sm">
        <span>Jump to:</span>
        <input type="number" className="w-16 px-2 py-1 text-white bg-[#171A24] rounded-md border-2 border-[#2A2E36]" 
          value={jumpPage} 
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJumpToPage()}
        />
        {/* <button className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600" onClick={handleJumpToPage}>Go</button> */}
      </div>
    </div>
    </div>
  );
};

export default DynamicPagination;
