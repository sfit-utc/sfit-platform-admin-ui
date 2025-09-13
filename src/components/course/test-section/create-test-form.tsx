"use client";
import { useState, useRef, useEffect } from "react";
import { useTestManagement } from "@/hooks/use-test-service";
import Line from "@/components/ui/line";
import Modal from "@/components/ui/modal";

interface CreateTestFormProps {
  state: boolean;
  funcClickToBack: (b: boolean) => void;
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
  state,
  funcClickToBack,
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
    <Modal
      state={state}
      funcClickToBack={funcClickToBack}
      className="max-w-2xl w-full"
    >
      <div style={{ backgroundColor: "var(--background)" }}>
        <div className="flex ">
          <span
            className="px-2 text-xl font-bold border-r"
            style={{
              color: "var(--foreground)",
              borderColor: "var(--sfit-gray-200)",
            }}
          >
            Thông tin cơ bản
          </span>
          <span
            className="px-2 text-xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Nhiệm vụ chung
          </span>
        </div>
        <div className="py-5 *:m-2">
          <div
            className="flex-2 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] p-4"
            style={{ backgroundColor: "var(--background)" }}
          >
            <form
              id="create-test-form"
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-5"
              style={{ color: "var(--foreground)" }}
            >
              {/* Row 1: Tên bài kiểm tra | Thời gian diễn ra */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-xl font-medium mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  Tên bài kiểm tra *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: errors.title
                      ? "var(--sfit-red-500)"
                      : "var(--sfit-gray-200)",
                  }}
                  placeholder="Nhập tên bài kiểm tra"
                />
                {errors.title && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--sfit-red-500)" }}
                  >
                    {errors.title}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  Thời gian diễn ra *
                </label>
                <div className="flex flex-col gap-4">
                  <div className="">
                    <span className="text-base mx-2">Ngày</span>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--sfit-gray-200)",
                      }}
                      required
                    />
                  </div>
                  <div className="">
                    <span className="text-base mx-2">Giờ</span>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--sfit-gray-200)",
                      }}
                      required
                    />
                  </div>
                </div>
                {errors.date && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--sfit-red-500)" }}
                  >
                    {errors.date}
                  </p>
                )}
                {errors.time && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--sfit-red-500)" }}
                  >
                    {errors.time}
                  </p>
                )}
              </div>

              {/* Row 2: Mô tả bài kiểm tra | Thời gian làm bài */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  Mô tả bài kiểm tra
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--sfit-gray-200)",
                  }}
                  placeholder="Nhập mô tả chi tiết về bài kiểm tra..."
                />
                {errors.description && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--sfit-red-500)" }}
                  >
                    {errors.description}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  Thời gian làm bài *
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: errors.duration
                      ? "var(--sfit-red-500)"
                      : "var(--sfit-gray-200)",
                  }}
                  placeholder="Nhập thời gian làm bài (phút)"
                />
                {errors.duration && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--sfit-red-500)" }}
                  >
                    {errors.duration}
                  </p>
                )}
              </div>

              {/* Row 3: Số lượng tham gia | Trạng thái */}
              <div>
                <label
                  htmlFor="participants"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  Số lượng tham gia *
                </label>
                <input
                  type="number"
                  id="participants"
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: errors.participants
                      ? "var(--sfit-red-500)"
                      : "var(--sfit-gray-200)",
                  }}
                  placeholder="Nhập số lượng tham gia"
                />
                {errors.participants && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--sfit-red-500)" }}
                  >
                    {errors.participants}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  Trạng thái
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: "var(--sfit-gray-200)",
                  }}
                >
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="past">Đã qua</option>
                </select>
              </div>

              {/* Row 4: Xếp hạng bài kiểm tra (spans both columns) */}
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRanking"
                  name="isRanking"
                  checked={formData.isRanking}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-green-600"
                  style={{ accentColor: "var(--sfit-green)" }}
                />
                <label
                  htmlFor="isRanking"
                  className="text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  Xếp hạng bài kiểm tra
                </label>
              </div>

              {/* Button row: span both columns */}
              <div className="col-span-2 flex justify-end space-x-4 pt-6">
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
                  form="create-test-form"
                  className="text-sm px-4 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--sfit-green)",
                    color: "var(--background)",
                  }}
                >
                  Tạo bài kiểm tra
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
