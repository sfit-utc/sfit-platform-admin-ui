"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTests } from "@/hooks/use-test-service";
import TestItem from "@/components/class/test-section/test-item";
import Loading from "@/components/ui/loading";

export default function TestList({ searchTerm }: { searchTerm: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage, setTestsPerPage] = useState(6); // Show 6 tests per page (2 rows of 3)

  // Use the hook to get tests
  const { data: tests, loading, error } = useTests();

  // Filter tests based on search term
  const filteredTests = useMemo(() => {
    if (!searchTerm.trim()) return tests;
    return tests.filter(
      (test) =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tests, searchTerm]);

  // Calculate pagination
  const totalItems = filteredTests.length;
  const totalPages = Math.ceil(totalItems / testsPerPage);
  const startIndex = (currentPage - 1) * testsPerPage;
  const endIndex = startIndex + testsPerPage;
  const currentTests = filteredTests.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading tests: {error.message}</p>
      </div>
    );
  }

  if (filteredTests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tests found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tests Grid */}
      <div className="flex flex-wrap">
        {currentTests.map((test) => (
          <TestItem key={test.id} test={test} />
        ))}
      </div>

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

      {/* Results Info */}
      <div className="text-center text-sm text-gray-500">
        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
        {totalItems} tests
      </div>
    </div>
  );
}
