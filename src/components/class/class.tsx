"use client";
import { useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import ClassList from "@/components/class/class-section/class-list";
import TestList from "@/components/class/test-section/test-list";
import CreateClassForm from "@/components/class/class-section/create-class-form";
import CreateTestForm from "@/components/class/test-section/create-test-form";

export default function Class() {
  const [activeTab, setActiveTab] = useState<"class" | "test">("class");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddClass = () => {
    setShowCreateForm(true);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      {!showCreateForm ? (
        <>
          {/* Tab Navigation */}
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab("class")}
              className={`text-xl font-semibold flex justify-center items-center cursor-pointer w-56 h-12 border-l border-r border-t transition-colors ${
                activeTab === "class"
                  ? "text-green-800 bg-white"
                  : "text-gray-600 bg-gray-50"
              }`}
            >
              Lớp học
            </button>
            <button
              onClick={() => setActiveTab("test")}
              className={`text-xl font-semibold flex justify-center items-center cursor-pointer w-56 h-12 border-l border-r border-t transition-colors ${
                activeTab === "test"
                  ? "text-green-800 bg-white"
                  : "text-gray-600 bg-gray-50"
              }`}
            >
              Bài kiểm tra
            </button>
          </div>

          {/* Search and Add Class & Contest */}
          <div className="flex justify-between items-center">
            {activeTab === "class" ? (
              <>
                <SearchBar
                  placeholder="Tìm lớp học"
                  className="w-96"
                  onSearch={handleSearch}
                />
                <button
                  onClick={handleAddClass}
                  className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex justify-center items-center hover:bg-green-800 transition-colors"
                >
                  <span className="text-white text-base font-bold font-inter">
                    + Tạo lớp học mới
                  </span>
                </button>
              </>
            ) : (
              <>
                <SearchBar
                  placeholder="Tìm contest"
                  className="w-96"
                  onSearch={handleSearch}
                />
                <button
                  onClick={handleAddClass}
                  className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex justify-center items-center hover:bg-green-800 transition-colors"
                >
                  <span className="text-white text-base font-bold font-inter">
                    + Tạo contest mới
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Content based on active tab */}
          {activeTab === "class" ? (
            <ClassList searchTerm={searchTerm} />
          ) : (
            <TestList searchTerm={searchTerm} />
          )}
        </>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="text-center py-8">
            {activeTab === "class" ? (
              <CreateClassForm
                onCancel={handleCancelCreate}
                onSuccess={handleCreateSuccess}
              />
            ) : (
              <CreateTestForm
                onCancel={handleCancelCreate}
                onSuccess={handleCreateSuccess}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
