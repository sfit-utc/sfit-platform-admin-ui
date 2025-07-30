"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { MemberListItem, MemberFilters } from "@/types/member";
import { useMembers } from "@/hooks/use-member-service";
import MemberItem from "@/components/member/member-item";
import Loading from "@/components/ui/loading";
import SearchBar from "@/components/ui/search-bar";
import AddMember from "@/components/member/add-member";
import { Rows2 } from "lucide-react";
import { Grid2X2 } from "lucide-react";
export default function MemberList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [activeStyle, setActiveStyle] = useState("line");
  const [addMember, setAddMember] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Memoize filters to prevent unnecessary re-renders
  const filters: MemberFilters = useMemo(
    () => ({
      search: searchTerm || undefined,
      role: filterRole !== "all" ? filterRole : undefined,
      team: filterTeam !== "all" ? filterTeam : undefined,
    }),
    [searchTerm, filterRole, filterTeam]
  );

  // Use the hook to get members
  const { data: members, loading, error } = useMembers(filters);

  const totalItems = members.length;
  const totalPages = Math.ceil(totalItems / membersPerPage);
  const startIdx = (currentPage - 1) * membersPerPage;
  const endIdx = startIdx + membersPerPage;
  const currentPageData = members.slice(startIdx, endIdx);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    }
    if (showFilterDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown]);

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

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleClick = useCallback(
    (val: string) => {
      setActiveStyle(val);
    },
    [activeStyle]
  );

  const changeMembersPerPage = useCallback(
    (val: number) => {
      setMembersPerPage(val);
    },
    [membersPerPage]
  );

  const MemberItemSkeleton = () => (
    <div className="flex justify-between items-center p-4 border-2 my-2 animate-pulse">
      <div className="h-6 w-1/12 bg-gray-300 rounded"></div>
      <div className="h-6 w-3/12 bg-gray-300 rounded ml-4"></div>
      <div className="h-8 w-2/12 bg-gray-300 rounded-full ml-4"></div>
      <div className="h-8 w-2/12 bg-gray-300 rounded-full ml-4"></div>
      <div className="h-8 w-2/12 bg-gray-300 rounded-full ml-4"></div>
      <div className="h-6 w-1/12 bg-gray-300 rounded ml-4"></div>
    </div>
  );

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="">
      <div className="my-5 py-2 flex justify-between">
        <div className="flex *:mx-2">
          <div className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex justify-center items-center">
            <div
              className="w-36 h-5 justify-center text-white text-base font-bold font-inter"
              onClick={() => setAddMember(true)}
            >
              + Thêm thành viên
            </div>
          </div>

          <SearchBar
            placeholder="Tra theo tên"
            onSearch={handleSearchChange}
            className="w-96"
          />

          <div className="*:text-green-700 flex justify-center items-center">
            <div
              className="mx-2 cursor-pointer rounded-full hover:bg-green-700 hover:text-white"
              onClick={handlePreviousPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left-icon lucide-chevron-left"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </div>
            <div className="text-lg flex whitespace-nowrap">
              <input
                type="text"
                name=""
                id=""
                className="w-6 rounded-md border-1 mr-1 text-center"
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const pageNumber = parseInt(
                      (e.target as HTMLInputElement).value
                    );
                    handlePageChange(pageNumber);
                  }
                }}
              />
              <span> / {totalPages}</span>
            </div>
            <div
              className="mx-2 cursor-pointer rounded-full hover:bg-green-700 hover:text-white"
              onClick={handleNextPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right-icon lucide-chevron-right"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>

          <div className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex justify-center items-center relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
            >
              <rect width="19" height="19" fill="url(#pattern0_1070_141)" />
              <defs>
                <pattern
                  id="pattern0_1070_141"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use xlinkHref="#image0_1070_141" transform="scale(0.01)" />
                </pattern>
                <image
                  id="image0_1070_141"
                  width="100"
                  height="100"
                  preserveAspectRatio="none"
                  xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAClklEQVR4nO3coWtWYRiG8UdFREUYCAaDIILBYrFYBGVJECxqMxltyxPBZlu0rZmWtCyZViwrC4ahEwafMBAmMqfOXXLghIPNb+d8z/2+5/79Bec9F3sHu9mJMDMz6xnwEJhgfWve6YNpgjjGcCbTBLEBOYgYBxHjIGIcRIyDVBBkK/uhK7Y1TZB54Gf2k1eoeafz/x2kjXIf+J19goocAI+mitGJ8hj4k32SChwCT44UoxPlafZpKrDQS4xOlGfZJyrYYq8xOlFeZp+sQEuDxGiDHANeZZ+wIMvNOxssSBvlOPA6+6QFWAFODBqjE+Uk8Cb7xMJWgVMzidGJchp4l31yQWvA2ZnG6EQ5B7zPfgNC1oG5lBidKHPtg4zdBnA+FAAXgA+M1yZwMZQAl4DPjM82cDkUAVeBL4zHDnAtlAHXga/Ubxe4ESUAbgLfqdcecCtK0g5c+9TnF3A3SlThwHVw5IEpW0UD12FvA1O2SgauhahJ4QPXYtSo0IFrKWpV4MC1PPjAlK2ggWtlZgNTtgIGrtWZD0zZhAeutbSBKZvgwLWePjBlExq4NmQGpmwCA9em3MA04oFrW3ZgGuHAtSM/MI1o4NotZmAawcC1V9zAlA243f6y7Vvzr3p3ss9nZmY2Ggws+3zFwUG04CBacBAtOIgWHEQLDqIFB9GCg2jBQbTgIFpwEC04iBYcRAsOogUH0YKDaMFBtOAgWnAQLTiIFhxECw6iBQfRgoNowUG04CBacBAtOIgWHEQL8HHIJtnnK/V7jfsOIgS4Arz1T4gY4F7fV1j2mWr5nNNz4IeDVHiNhWldY2Fa11iY1jUWpnWNhWldY2Fa11hY6p9gPv3TY+IeiYAzwIv2o2jfmkgOYmZmUZm/eQ9AEjFMSuEAAAAASUVORK5CYII="
                />
              </defs>
            </svg>

            <div
              className="w-36 h-5 justify-center ml-2 text-white text-base font-bold font-inter"
              onClick={() => setShowFilterDropdown((prev) => !prev)}
            >
              Lựa chọn
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="11"
              viewBox="0 0 18 11"
              fill="none"
            >
              <path
                d="M9.71074 10.2819C9.3194 10.6773 8.6806 10.6773 8.28926 10.2819L0.293676 2.20345C-0.331285 1.57201 0.115997 0.5 1.00442 0.5L16.9956 0.5C17.884 0.5 18.3313 1.57201 17.7063 2.20345L9.71074 10.2819Z"
                fill="white"
              />
            </svg>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div
                ref={filterDropdownRef}
                className="absolute top-full left-0 mt-2 w-64 rounded-lg shadow-lg z-50 p-4"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Chức vụ
                    </label>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--sfit-gray-200)",
                      }}
                    >
                      <option value="all">Tất cả</option>
                      <option value="Chủ nhiệm">Chủ nhiệm</option>
                      <option value="Phó CN">Phó CN</option>
                      <option value="Trưởng ban">Trưởng ban</option>
                      <option value="Phó ban">Phó ban</option>
                      <option value="Thành viên">Thành viên</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ban
                    </label>
                    <select
                      value={filterTeam}
                      onChange={(e) => setFilterTeam(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--sfit-gray-200)",
                      }}
                    >
                      <option value="all">Tất cả</option>
                      <option value="Học tập">Học tập</option>
                      <option value="Hậu cần">Hậu cần</option>
                      <option value="Đối ngoại">Đối ngoại</option>
                      <option value="Truyền thông">Truyền thông</option>
                      <option value="Kỹ thuật">Kỹ thuật</option>
                      <option value="Data & AI">Data & AI</option>
                      <option value="IOT">IOT</option>
                      <option value="Game">Game</option>
                      <option value="Web">Web</option>
                      <option value="Chuyên môn">Chuyên môn</option>
                      <option value="Cán sự">Cán sự</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex">
          <button
            onClick={() => handleClick("line")}
            className={`px-4 py-2 rounded-l-2xl ${
              activeStyle === "line"
                ? "bg-green-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <Rows2 />
          </button>
          <button
            onClick={() => handleClick("box")}
            className={`px-4 py-2 rounded-r-2xl ${
              activeStyle === "box"
                ? "bg-green-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <Grid2X2 />
          </button>
        </div>
      </div>

      <div className="my-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span>Hiển thị:</span>
            <select
              value={membersPerPage}
              onChange={(e) => changeMembersPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--sfit-gray-200)",
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>thành viên</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <MemberItemSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div
            className={
              activeStyle === "box"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                : "space-y-2"
            }
          >
            {currentPageData.map((member) => (
              <MemberItem key={member.id} member={member} style={activeStyle} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded disabled:opacity-50"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded ${
                      currentPage === page ? "bg-green-700 text-white" : ""
                    }`}
                    style={{
                      backgroundColor:
                        currentPage === page
                          ? "var(--sfit-green)"
                          : "var(--background)",
                      color: "var(--foreground)",
                      borderColor: "var(--sfit-gray-200)",
                    }}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded disabled:opacity-50"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {addMember && (
        <AddMember state={addMember} funcClickToBack={setAddMember} />
      )}
    </div>
  );
}
