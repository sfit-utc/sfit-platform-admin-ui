"use client";
import { useState, useRef, useEffect } from "react";
import { useTestManagement } from "@/hooks/use-test-service";
import Line from "@/components/ui/line";

interface CreateTestFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

// Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

// Helper function to format time from HH:MM to HH:MM format
function formatTime(timeStr: string) {
  if (!timeStr) return "";
  return timeStr;
}

export default function CreateTestForm({
  onCancel,
  onSuccess,
}: CreateTestFormProps) {
  const { createTest, loading } = useTestManagement();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    status: "upcoming" as "ongoing" | "upcoming" | "past",
    isRanking: false,
    participants: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value) || 0
          : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim())
      newErrors.title = "Tên bài kiểm tra là bắt buộc";
    if (!formData.date) newErrors.date = "Ngày diễn ra là bắt buộc";
    if (!formData.time.trim()) newErrors.time = "Giờ diễn ra là bắt buộc";
    if (!formData.duration.trim())
      newErrors.duration = "Thời gian làm bài là bắt buộc";
    if (formData.participants <= 0)
      newErrors.participants = "Số lượng tham gia phải lớn hơn 0";
    if (!formData.description.trim())
      newErrors.description = "Mô tả là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await createTest({
        ...formData,
        date: `${formatTime(formData.time)} ${formatDate(
          formData.date.split("T")[0]
        )}`,
        time: formData.duration,
      });
      alert("Tạo bài kiểm tra thành công!");
      onSuccess();
    } catch (error) {
      alert(
        "Tạo bài kiểm tra thất bại: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex ">
          <span className="px-2 text-xl font-bold text-gray-800 border-r">
            Thông tin cơ bản
          </span>
          <span className="px-2 text-xl font-bold text-gray-800 ">
            Nhiệm vụ chung
          </span>
        </div>
        <div className="flex py-5 *:m-2">
          <div className="flex-2 bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] p-4">
            <form
              id="create-test-form"
              onSubmit={handleSubmit}
              className="space-y-6 *:text-gray-800 [&_label]:text-xl [&_label]:text-left"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-xl font-medium  mb-2"
                >
                  Tên bài kiểm tra *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={` w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập tên bài kiểm tra"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mô tả bài kiểm tra
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nhập mô tả chi tiết về bài kiểm tra..."
                />
              </div>

              {/* Date and Time */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian diễn ra *
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-base mx-2">Ngày</span>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <span className="text-base mx-2">Giờ</span>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Thời gian làm bài *
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.duration ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ví dụ: 2 giờ, 90 phút, 1.5 giờ"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>

              {/* Participants */}
              <div>
                <label
                  htmlFor="participants"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Số lượng tham gia tối đa *
                </label>
                <input
                  type="number"
                  id="participants"
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.participants ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập số lượng tham gia tối đa"
                />
                {errors.participants && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.participants}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Trạng thái bài kiểm tra
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="past">Đã qua</option>
                </select>
              </div>

              {/* Is Ranking */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isRanking"
                    checked={formData.isRanking}
                    onChange={handleInputChange}
                    className="accent-green-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Có xếp hạng
                  </span>
                </label>
              </div>
            </form>
          </div>
          <div className="p-5 text-gray-800  flex-1 bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] font-inter">
            <div className="text-xl">Xuất bản</div>
            <Line />
            <div className="flex flex-col text-left">
              <div className="text-sm my-1">
                Tiêu đề:{" "}
                <span className="text-sfit-green"> {formData.title}</span>
              </div>
              <div className="text-sm my-1">
                Thời gian diễn ra:{" "}
                <span className="text-sfit-green">
                  {formData.date && formData.time
                    ? `${formatTime(formData.time)} ${formatDate(
                        formData.date.split("T")[0]
                      )}`
                    : "Chưa chọn"}
                </span>
              </div>
              <div className="text-sm my-1">
                Thời gian làm bài:{" "}
                <span className="text-sfit-green">
                  {" "}
                  {formData.duration || "Chưa nhập"}
                </span>
              </div>
              <div className="text-sm my-1">
                Số lượng tham gia:{" "}
                <span className="text-sfit-green">
                  {" "}
                  {formData.participants}
                </span>
              </div>
              <div className="text-sm my-1">
                Trạng thái:{" "}
                <span className="text-sfit-green"> {formData.status}</span>
              </div>
              <div className="text-sm my-1">
                Xếp hạng:{" "}
                <span className="text-sfit-green">
                  {" "}
                  {formData.isRanking ? "Có" : "Không"}
                </span>
              </div>
              <div className="text-sm my-1">
                Mô tả:{" "}
                <span className="text-sfit-green"> {formData.description}</span>
              </div>
            </div>
            <Line />
            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="text-sm px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                form="create-test-form"
                type="submit"
                disabled={loading}
                className="text-sm px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang tạo..." : "Tạo bài kiểm tra"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
