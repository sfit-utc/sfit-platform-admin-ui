"use client";
import TaskEventList from "./task-event-list";
import { useCallback, useEffect, useState } from "react";
import CreateTaskForm from "./create-task-form";
import { useTaskService } from "@/hooks/use-task-service";
export default function Task() {
  const [activeTab, setActiveTab] = useState<
    "ALL" | "ONGOING" | "UPCOMING" | "COMPLETED"
  >("ALL");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [counts, setCounts] = useState({
    all: 0,
    ongoing: 0,
    upcoming: 0,
    done: 0,
  });
  const { fetchTasks, tasks } = useTaskService();


  // const reloadCounts = async () => {
  //   await fetchTasks({ page: 1, page_size: -1 });
  //   setCounts({
  //     all: tasks.length,
  //     ongoing: tasks.filter((t) => t.PercentComplete > 0 && t.PercentComplete < 100).length,
  //     upcoming: tasks.filter((t) => t.PercentComplete === 0).length,
  //     done: tasks.filter((t) => t.PercentComplete === 100).length,
  //   });
  // };
  const reloadCounts = useCallback(async () => {
    await fetchTasks({ page: 1, page_size: -1 });
    setCounts({
      all: tasks.length,
      ongoing: tasks.filter((t) => (t as any).PercentComplete > 0 && (t as any).PercentComplete < 100).length,
      upcoming: tasks.filter((t) => (t as any).PercentComplete === 0).length,
      done: tasks.filter((t) => (t as any).PercentComplete === 100).length,
    });
  }, [fetchTasks]);
  useEffect(() => {
    reloadCounts();
  }, [reloadCounts]);

  useEffect(() => {
    setCounts({
      all: tasks.length,
      ongoing: tasks.filter((t) => (t as any).PercentComplete > 0 && (t as any).PercentComplete < 100).length,
      upcoming: tasks.filter((t) => (t as any).PercentComplete === 0).length,
      done: tasks.filter((t) => (t as any).PercentComplete === 100).length,
    });
  }, [tasks]);

  const handleAddTask = () => setShowCreateForm(true);
  const handleCancelCreate = () => setShowCreateForm(false);
  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    reloadCounts();
  };
  return (
    <div className="pt-6 min-h-screen space-y-6 w-full">
      <div className="flex items-center">
        <button
          style={{
            backgroundColor: "var(--background)",
          }}
          onClick={() => setActiveTab("ALL")}
          className={`text-xl font-semibold flex justify-center items-center cursor-pointer w-56 h-12 border-l border-r border-t transition-colors ${activeTab === "ALL"
            ? "text-green-800 bg-white"
            : "text-gray-600 bg-gray-50"
            }`}
        >
          Tổng nhiệm vụ
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
            {counts.all}
          </span>
        </button>
        <button
          style={{
            backgroundColor: "var(--background)",
          }}
          onClick={() => setActiveTab("ONGOING")}
          className={`text-xl font-semibold flex justify-center items-center cursor-pointer w-56 h-12 border-l border-r border-t transition-colors ${activeTab === "ONGOING"
            ? "text-green-800 bg-white"
            : "text-gray-600 bg-gray-50"
            }`}
        >
          Đang thực hiện
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
            {counts.ongoing}
          </span>
        </button>
        <button
          style={{
            backgroundColor: "var(--background)",
          }}
          onClick={() => setActiveTab("UPCOMING")}
          className={`text-xl font-semibold flex justify-center items-center cursor-pointer w-56 h-12 border-l border-r border-t transition-colors ${activeTab === "UPCOMING"
            ? "text-green-800 bg-white"
            : "text-gray-600 bg-gray-50"
            }`}
        >
          Chưa bắt đầu
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
            {counts.upcoming}
          </span>
        </button>
        <button
          style={{
            backgroundColor: "var(--background)",
          }}
          onClick={() => setActiveTab("COMPLETED")}
          className={`text-xl font-semibold flex justify-center items-center cursor-pointer w-56 h-12 border-l border-r border-t transition-colors ${activeTab === "COMPLETED"
            ? "text-green-800 bg-white"
            : "text-gray-600 bg-gray-50"
            }`}
        >
          Hoàn thành
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
            {counts.done}
          </span>
        </button>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="flex items-center px-4 py-2 rounded-full bg-green-700 text-white font-semibold text-base hover:bg-green-600"
          onClick={handleAddTask}
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
        <TaskEventList status={activeTab} onTaskChanged={reloadCounts} />
      </div>
      <CreateTaskForm
        state={showCreateForm}
        funcClickToBack={setShowCreateForm}
        onCancel={handleCancelCreate}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
