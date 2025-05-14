import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPaginationNumbers = (): (number | string)[] => {
    if (!totalPages) return [];

    let pagesToShow: (number | string)[] = [];

    if (totalPages <= 5) {
      pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pagesToShow = [1];
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pagesToShow.push("...");
      for (let i = start; i <= end; i++) {
        pagesToShow.push(i);
      }
      if (end < totalPages - 1) pagesToShow.push("...");
      if (totalPages > 1) pagesToShow.push(totalPages);
    }

    return pagesToShow;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 mb-6">
      <motion.button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`w-9 h-9 flex items-center justify-center rounded-md text-base ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary text-white"
        }`}
        whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft color="white" />
      </motion.button>

      {renderPaginationNumbers().map((pageNum, index) =>
        pageNum === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <motion.button
            key={pageNum}
            onClick={() => onPageChange(Number(pageNum))}
            className={`w-9 h-9 flex items-center justify-center rounded-md text-base ${
              pageNum === currentPage
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {pageNum}
          </motion.button>
        )
      )}

      <motion.button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`w-9 h-9 flex items-center justify-center rounded-md text-base ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-primary text-white"
        }`}
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight color="white" />
      </motion.button>
    </div>
  );
};

export default Pagination;
