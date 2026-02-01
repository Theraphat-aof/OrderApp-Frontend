'use client';

import React from 'react';
import { useFilters } from '@/hooks/useFilters';

interface PaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
}

export function Pagination({
  total,
  pageSize,
  currentPage,
}: PaginationProps) {
  const { setPage } = useFilters();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const pages = [];
  const maxPagesToShow = 7;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 my-8 flex-wrap">
      <button
        onClick={() => setPage(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm"
      >
        First
      </button>

      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => setPage(1)}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-500">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setPage(page)}
          className={`px-3 py-2 rounded-lg border font-medium text-sm ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
          <button
            onClick={() => setPage(totalPages)}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm"
      >
        Next
      </button>

      <button
        onClick={() => setPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm"
      >
        Last
      </button>
    </div>
  );
}
