import React from "react";
import { Button } from "react-bootstrap";
import "./Pagination.css";

const Pagination = ({ totalItems, perPage, setCurrentPage, currentPage }) => {
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalItems / perPage); i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {pages.map((page, index) => {
        return (
          <Button key={index} onClick={() => setCurrentPage(page)} className={page === currentPage ? "active" : ""}>
            {page}
          </Button>
        );
      })}
    </div>
  );
};

export default Pagination;
