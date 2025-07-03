"use client";
import TabBar from "../ui/tabBar";
import TaskCard from "../ui/card-task";
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
    <div className="pt-6 min-h-screen space-y-6 w-full">
      <div className="flex justify-between">
        <div className="border-black border-b-[1.5px]" 
        style={{width: "35px"}}>

        </div>
        <TabBar
          tabs={tabs}
          activeValue={active}
          onTabChange={handleTabChange}
        />
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
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mt-2">
        <div className="title">
          <h1 className="text-2xl font-bold mb-2 text-black border-black border-b-[1.5px] p-2 flex justify-between items-center">
            Sự kiện OLP Tin học
            <div className="flex">
              <div className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="20"
                  height="20"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <rect width="28" height="28" fill="url(#pattern0_1070_151)" />
                  <defs>
                    <pattern
                      id="pattern0_1070_151"
                      patternContentUnits="objectBoundingBox"
                      width="1"
                      height="1"
                    >
                      <use xlinkHref="#image0_1070_151" transform="scale(0.01)" />
                    </pattern>
                    <image
                      id="image0_1070_151"
                      width="100"
                      height="100"
                      preserveAspectRatio="none"
                      xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADwklEQVR4nO2dS6hNURzGt7xmjCRRDMnAK8mrFClFkkKUmYEwkQxdE2WgONRZ37f2vQOv4iTmlFcxZWLkNUDJQLnEjXK1co+O6+5z9vOc5azvV3t2zv+stX/nv15777WjSAghhBBCCCGEd9RqtRkAtllr98VxvKjX5QkakmsAvCE52nK8BHCuXq8v63X5gsIYsxbA8DgZfx0AHlpr1/e6rH2PSSFj3NEYGhqa1ety9yUmu4xmtrwHsLHX5e/HPmM4q4yW44e19kCv6xF0ZvDfTPlpjNnf6/qEIOMWyfMkX6QQ813NV7WjqSuNRmNy8zsktwB40qlPUUffBRlNSE4FgE6jr6xlChZTQEYrJI93kLKue7UKXEaTdpkC4P6fD4rqZTSbL5JPk+JZa5emjRUUpgIZrR19m7hnq6lR/w9tb+eR0aTNkPhFubUJZNIH4BvJzXl/Z2yekhR/Ybm1CmQGjpxSXGYBuNkm9t4odEz+hcJMUsZkXGkX01q7KwoZU3BtKq2UNDIAfCA5MwoVk3I0RdIUkZJSxrArTxQqTLGEDuD6wMDAlNHR0UkALnTIlhFr7dYEGZc6/M4XY8yGKFSYQUbzO3mkSEZFMvJIkYwuzcCdFJL1FH3KbfUZFWVGzkxRn9ENGUWlqANn+TLySpEMVicjqxTJYPUyHBpNpUAyPILKDH+gZPgDJcMfKBn+QMnwB0qGP1Ay/IGS4Q+UDH+QDI+QjP/vmb5rWiiUjLBQZniEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEZHiEtXYeyY8droFfLrLFkUM7JKQEwIBkeATJe7o7xBPcrTgkPyfdqqNmqsvEcbyiTXasLBJbD1jmgOThBBlfG43GtCgnkpETklcThDzIG1MyCkDydYKQ03niSUYBSM5J6j+MMduzxpOMgpDcmSQkjuPZWWJJRgmQPJOwhcXzLHEkoyRIPk7IkItpY0hGSdRqteljO6lNJORgyo3qV7nJY4cNY4aD3r0zy+pumw59yQSfn0lyE8mTAO64eYq2OCoRkseS/tFuQmitXexegsXfPHMvxUq78Zf2m8oBgBsJJ9I1Y5+ynHw1UyVA8m2Rk67MKBFjzIIqZLiLXOrAcwBgd4kS3NL9XZInjDFz85QneAAcKdAkvXKbFwM45F51XfTRZtH5GkjrMQLgkZvRW2t3uLUvncCKIHlqgn//Ozf6AnAUwGo3eazq98UEkFw+doFqz+Dg4HydJCGEEEIIIYSI+oJfm/8/Fy7JNMoAAAAASUVORK5CYII="
                    />
                  </defs>
                </svg>
              </div>
              <div className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="20"
                  height="20"
                  viewBox="0 0 25 26"
                  fill="none"
                >
                  <rect
                    y="0.5"
                    width="25"
                    height="25"
                    fill="url(#pattern0_1070_169)"
                  />
                  <defs>
                    <pattern
                      id="pattern0_1070_169"
                      patternContentUnits="objectBoundingBox"
                      width="1"
                      height="1"
                    >
                      <use xlinkHref="#image0_1070_169" transform="scale(0.01)" />
                    </pattern>
                    <image
                      id="image0_1070_169"
                      width="100"
                      height="100"
                      preserveAspectRatio="none"
                      xlinkHref="data:image/png;base64,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"
                    />
                  </defs>
                </svg>
              </div>
            </div>
          </h1>
        </div>
        <p className="font-[570] mb-2 text-black text-xl p-2">Danh sách nhiệm vụ</p>
        <div className="">
          <TaskCard
            title="Thiết kế poster cho cuộc thi lập trình"
            tags={[
              { label: "Đang thực hiện", color: "bg-yellow-500", textColor: "text-white" },
              { label: "Cao", color: "bg-red-500", textColor: "text-white" },
              { label: "Design", color: "bg-green-700", textColor: "text-white" },
            ]}
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quasi porro placeat ratione labore enim pariatur vero molestias delectus rem."
            startDate="01/06/2025"
            deadline="25/05/2025"
            assignee="Nguyễn Công Thắng"
            progress={60}
          />
        </div>
      </div>
    </div>
  );
}
