"use client";
import TabBar from "../ui/tabBar";
import { TabBarTab } from "../ui/tabBar";
import { useState } from "react";
const tabs: TabBarTab[] = [
  { label: "Tổng nhiệm vụ", value: "all", count: 9 },
  { label: "Đang thực hiện", value: "doing", count: 3 },
  { label: "Chưa bắt đầu", value: "not_begin", count: 3 },
  { label: "Hoàn thành", value: "done", count: 7 },
];

export default function Task() {
  const [active, setActive] = useState("all");

  const handleTabChange = (value: string | number) => {
    if (typeof value === "string") {
      setActive(value);
    } else {
      setActive(String(value));
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex ">
        <TabBar
          tabs={tabs}
          activeValue={active}
          onTabChange={handleTabChange}
        />
        <div
          className="ml-4 flex items-center px-4 py-1.5 rounded-full bg-red-100 text-red-600 font-semibold text-base border border-red-200 select-none"
          style={{ minWidth: 180 }}
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
        </div>
      </div>
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mt-2">
        <div className="title">
          <h2 className="text-xl font-bold mb-2 text-black">
            Sự kiện OLP Tin học
          </h2>
          <div></div>
        </div>
        <p className=" font-bold mb-2 text-black">Danh sách nhiệm vụ</p>
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mt-2">
          <h3 className="text-lg font-bold text-black mb-2">
            Thiết kế poster cho cuộc thi lập trình
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-semibold">
              Đang thực hiện
            </span>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
              Cá nhân
            </span>
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-semibold">
              Design
            </span>
          </div>
          <p className="text-gray-700 text-sm mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            quasi porro placeat ratione labore enim pariatur vero molestias
            delectus rem. Voluptate debitis repudiandae blanditiis aliquid et
            dicta, nihil accusamus quod!
          </p>
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-col gap-2 text-sm">
              <span className="text-green-600 font-semibold flex items-center">
                <svg width="16" height="16" fill="none" className="mr-1">
                  <circle cx="8" cy="8" r="8" fill="#22c55e" />
                </svg>
                Thời gian diễn ra:{" "}
                <span className="ml-1 text-black font-normal">01/06/2025</span>
              </span>
              <span className="text-red-600 font-semibold flex items-center">
                <svg width="16" height="16" fill="none" className="mr-1">
                  <circle cx="8" cy="8" r="8" fill="#f44336" />
                </svg>
                Deadline:{" "}
                <span className="ml-1 text-black font-normal">25/05/2025</span>
              </span>
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Phụ trách:</span> Nguyễn Công
              Thắng
            </div>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-700">
                Tiến độ
              </span>
              <span className="text-sm font-semibold text-gray-700">60%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
