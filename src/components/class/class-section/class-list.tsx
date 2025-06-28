"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useClasses } from "@/hooks/use-class-service";
import ClassItem from "@/components/class/class-section/class-item";
import Loading from "@/components/ui/loading";

export default function ClassList({ searchTerm }: { searchTerm: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [classesPerPage, setClassesPerPage] = useState(6); // Show 6 classes per page (2 rows of 3)

  // Use the hook to get classes with search
  const { data: classes, loading, error } = useClasses(searchTerm);

  // Calculate pagination
  const totalItems = classes.length;
  const totalPages = Math.ceil(totalItems / classesPerPage);
  const startIdx = (currentPage - 1) * classesPerPage;
  const endIdx = startIdx + classesPerPage;
  const currentPageData = classes.slice(startIdx, endIdx);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages]
  );

  // Loading skeleton for classes
  const ClassItemSkeleton = () => (
    <div className="bg-white rounded-[10px] shadow p-4 h-full flex flex-col justify-between min-h-[320px] animate-pulse">
      <div className="flex justify-between mb-2">
        <div className="h-6 w-48 bg-gray-300 rounded"></div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded mt-4"></div>
    </div>
  );

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Classes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: classesPerPage }).map((_, index) => (
            <ClassItemSkeleton key={index} />
          ))}
        </div>
      ) : currentPageData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? "Không tìm thấy lớp học nào phù hợp."
            : "Chưa có lớp học nào."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPageData.map((classItem) => (
            <ClassItem key={classItem.id} classItem={classItem} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-2 text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-green-700 hover:text-white rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const pageNumber = parseInt(e.target.value);
                if (!isNaN(pageNumber)) {
                  handlePageChange(pageNumber);
                }
              }}
              className="w-12 h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="text-gray-600">/ {totalPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-green-700 hover:text-white rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
