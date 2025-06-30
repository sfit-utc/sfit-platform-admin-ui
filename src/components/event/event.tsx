"use client";
import { useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import EventList from "@/components/event/event-list";
import CreateEventForm from "@/components/event/create-event-form";

export default function Event() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming" | "past">(
    "ongoing"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddEvent = () => {
    setShowCreateForm(true);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    // Optionally refresh the event list here
  };

  return (
    <div className="space-y-6">
      {!showCreateForm ? (
        <>
          {/* Tab Navigation */}
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab("ongoing")}
              className={`text-xl font-semibold flex justify-center items-center cursor-pointer w-56 h-12 border-l border-r border-t transition-colors ${
                activeTab === "ongoing"
                  ? "text-green-800 bg-white"
                  : "text-gray-600 bg-gray-50"
              }`}
            >
              Sự kiện đang diễn ra
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`text-xl font-semibold flex justify-center items-center cursor-pointer w-56 h-12 border-l border-r border-t transition-colors ${
                activeTab === "upcoming"
                  ? "text-green-800 bg-white"
                  : "text-gray-600 bg-gray-50"
              }`}
            >
              Sự kiện sắp diễn ra
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`text-xl font-semibold flex justify-center items-center cursor-pointer w-56 h-12 border-l border-r border-t transition-colors ${
                activeTab === "past"
                  ? "text-green-800 bg-white"
                  : "text-gray-600 bg-gray-50"
              }`}
            >
              Sự kiện đã qua
            </button>
          </div>

          {/* Search and Add Event */}
          <div className="flex justify-between items-center">
            <SearchBar
              placeholder="Tìm sự kiện"
              className="w-96"
              onSearch={handleSearch}
            />
            <button
              onClick={handleAddEvent}
              className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex justify-center items-center hover:bg-green-800 transition-colors"
            >
              <span className="text-white text-base font-bold font-inter">
                + Thêm sự kiện mới
              </span>
            </button>
          </div>

          {/* Event List */}
          <div>
            <EventList status={activeTab} searchTerm={searchTerm} />
          </div>
        </>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <CreateEventForm
            onCancel={handleCancelCreate}
            onSuccess={handleCreateSuccess}
          />
        </div>
      )}
    </div>
  );
}
