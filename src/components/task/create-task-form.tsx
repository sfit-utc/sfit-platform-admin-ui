"use client";
import { useState, useEffect } from "react";
import Line from "@/components/ui/line";
import { useEventService } from "@/hooks/use-event-service";
import { useTaskService } from "@/hooks/use-task-service";
import Modal from "@/components/ui/modal";
import { CreateTaskReq } from "@/types/task";
interface CreateTaskFormProps {
  state: boolean;
  funcClickToBack: (b: boolean) => void;
  onCancel: () => void;
  onSuccess: () => void;
}

const initialTags = [
  { label: "Quan trọng", color: "#F87171", textColor: "#fff" },
  { label: "Khẩn cấp", color: "#FBBF24", textColor: "#fff" },
  { label: "Bình thường", color: "#34D399", textColor: "#fff" },
];

export default function CreateTaskForm({
  state,
  funcClickToBack,
  onCancel,
  onSuccess,
}: CreateTaskFormProps) {
  const { events, fetchEvents, loading: loadingEvents } = useEventService();
  const { createTask, loading } = useTaskService();
  const [createTaskReq, setCreateTaskReq] = useState<CreateTaskReq>({
    name: "",
    description: "",
    event_id: "",
    startTime: "",
    dateline: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [loading, setLoading] = useState(false);
  useEffect(() => {
  if (!events || events.length === 0) {
    fetchEvents({ page: 1, page_size: -1 });
  }
}, []);
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCreateTaskReq((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!createTaskReq.event_id) newErrors.event_id = "Vui lòng chọn sự kiện";
    if (!createTaskReq.name.trim())
      newErrors.name = "Tiêu đề nhiệm vụ là bắt buộc";
    if (!createTaskReq.startTime) newErrors.startTime = "Ngày bắt đầu là bắt buộc";
    if (!createTaskReq.dateline) newErrors.dateline = "Hạn chót là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      // Chỉ truyền đúng các trường cần thiết cho API
      await createTask({
        name: createTaskReq.name,
        description: createTaskReq.description,
        event_id: createTaskReq.event_id,
        startTime: createTaskReq.startTime,
        dateline: createTaskReq.dateline,
      });
      alert("Tạo nhiệm vụ thành công!");
      onSuccess();
    } catch (error) {
      alert(
        "Tạo nhiệm vụ thất bại: " +
        (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };
  return (
    <Modal
      state={state}
      funcClickToBack={funcClickToBack}
      className="max-w-2xl min-w-4/5"
    >
      <div style={{ color: "var(--foreground)" }}>
        <div
          className="rounded-lg shadow-lg p-8"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div className="flex">
            <span
              className="px-2 text-xl font-bold border-r"
              style={{
                color: "var(--foreground)",
                borderColor: "var(--sfit-gray-200)",
              }}
            >
              Thông tin nhiệm vụ
            </span>
            <span
              className="px-2 text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Chi tiết
            </span>
          </div>
          <div className="flex py-5 *:m-2">
            <div
              className="flex-5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] p-4"
              style={{ backgroundColor: "var(--background)" }}
            >
              <form
                id="create-task-form"
                onSubmit={handleSubmit}
                className="space-y-6 flex gap-5"
                style={{ color: "var(--foreground)" }}
              >
                <div className="w-full">
                  {/* Event */}
                  <div>
                    <label
                      htmlFor="event_id"
                      className="block text-xl font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Chọn sự kiện *
                    </label>
                    <select
                      id="event_id"
                      name="event_id"
                      value={createTaskReq.event_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: errors.event_id
                          ? "var(--sfit-red-500)"
                          : "var(--sfit-gray-200)",
                      }}
                      disabled={loadingEvents}
                    >
                      <option value="">-- Chọn sự kiện --</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                    {errors.event_id && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--sfit-red-500)" }}
                      >
                        {errors.event_id}
                      </p>
                    )}
                  </div>
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xl font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Tiêu đề nhiệm vụ *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={createTaskReq.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: errors.name
                          ? "var(--sfit-red-500)"
                          : "var(--sfit-gray-200)",
                      }}
                      placeholder="Nhập tiêu đề nhiệm vụ"
                    />
                    {errors.name && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--sfit-red-500)" }}
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>
                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Mô tả nhiệm vụ
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={createTaskReq.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--sfit-gray-200)",
                      }}
                      placeholder="Nhập mô tả chi tiết..."
                    />
                  </div>
                </div>
                <div className="w-full">
                  {/* Start Date */}
                  <div>
                    <label
                      htmlFor="startTime"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Ngày bắt đầu *
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      value={createTaskReq.startTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: errors.startTime
                          ? "var(--sfit-red-500)"
                          : "var(--sfit-gray-200)",
                      }}
                    />
                    {errors.startTime && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--sfit-red-500)" }}
                      >
                        {errors.startTime}
                      </p>
                    )}
                  </div>
                  {/* dateline */}
                  <div>
                    <label
                      htmlFor="dateline"
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      Hạn chót *
                    </label>
                    <input
                      type="datetime-local"
                      id="dateline"
                      name="dateline"
                      value={createTaskReq.dateline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: errors.dateline
                          ? "var(--sfit-red-500)"
                          : "var(--sfit-gray-200)",
                      }}
                    />
                    {errors.dateline && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--sfit-red-500)" }}
                      >
                        {errors.dateline}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div
              className="p-5 flex-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] font-inter"
              style={{
                color: "var(--foreground)",
                backgroundColor: "var(--background)",
              }}
            >
              <div className="text-xl">Xuất bản</div>
              <Line />
              <div className="text-sm my-1">
                Tiêu đề:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {createTaskReq.name}
                </span>
              </div>
              <div className="text-sm my-1">
                Người thực hiện:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {/* Nếu có trường assignee thì hiển thị ở đây */}
                </span>
              </div>
              <div className="text-sm my-1">
                Ngày bắt đầu:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {createTaskReq.startTime}
                </span>
              </div>
              <div className="text-sm my-1">
                Hạn chót:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {createTaskReq.dateline}
                </span>
              </div>
              <div className="text-sm my-1">
                Mô tả:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {createTaskReq.description}
                </span>
              </div>
              <Line />
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-sm px-4 py-2 border rounded-lg font-medium transition-colors"
                  style={{
                    borderColor: "var(--sfit-gray-200)",
                    color: "var(--foreground)",
                    backgroundColor: "var(--background)",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  form="create-task-form"
                  className="text-sm px-4 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--sfit-green)",
                    color: "var(--background)",
                  }}
                  disabled={loading}
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}