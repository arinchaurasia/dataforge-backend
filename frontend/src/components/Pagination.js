import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between mt-8">
      <p className="text-slate-400 text-sm">
        Page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white font-medium">{totalPages || 1}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentPage <= 1
              ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed'
              : 'text-white bg-slate-800 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentPage >= totalPages
              ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed'
              : 'text-white bg-slate-800 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
