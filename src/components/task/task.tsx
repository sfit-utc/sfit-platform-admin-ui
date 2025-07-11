"use client";
import TaskEventList from "./task-event-list";
import { useState } from "react";
export default function Task() {
    const [activeTab, setActiveTab] = useState<"all" | "ongoing" | "upcoming" | "done">("all");
    const [showCreateForm, setShowCreateForm] = useState(false);

    return (
        <div className="pt-6 min-h-screen space-y-6 w-full">
            <div className="flex justify-between">
                <div className="border-black border-b-[1.5px]" style={{ width: "35px" }}></div>
                <div className="flex bg-white">
                    {[
                        { label: "Tổng nhiệm vụ", value: "all", count: 9 },
                        { label: "Đang thực hiện", value: "ongoing", count: 3 },
                        { label: "Chưa bắt đầu", value: "upcoming", count: 3 },
                        { label: "Hoàn thành", value: "done", count: 3 },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            className={`flex items-center px-4 py-2 font-semibold text-base ${activeTab === tab.value
                                ? "border-l-[1.5px] border-r-[1.5px] border-t-[1.5px] border-black text-green-700"
                                : "border-b-[1.5px] border-black text-gray-700 hover:text-green-600"
                                }`}
                            style={{
                                minWidth: 120,
                                outline: "none",
                                background: "none",
                                cursor: "pointer",
                            }}
                            onClick={() => setActiveTab(tab.value as typeof activeTab)}
                        >
                            <span>{tab.label}</span>
                            {typeof tab.count === "number" && (
                                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <div className=" border-black border-b-[1.5px] flex-1 flex justify-end">
                    <button
                        className="flex items-center px-2 py-0 mb-[10px] rounded-full bg-red-100 text-red-600 font-semibold text-base border border-red-200 select-none"
                    >
                        11/06 - 20/06/2025
                        <svg
                            className="ml-1"
                            width={18}
                            height={18}
                            viewBox="0 0 20 20"
                            fill="none"
                        >
                            <path
                                d="M6 8L10 12L14 8"
                                stroke="#F44336"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    className="flex items-center text-sm px-4 py-2 rounded-full bg-green-700 text-white font-semibold text-base hover:bg-green-600"
                >
                    <svg
                        className="mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Tạo nhiệm vụ mới
                </button>
            </div>
            <div>
                <TaskEventList status={activeTab} />
            </div>
        </div>
    );
}