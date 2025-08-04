"use client";
import { useState } from "react";
import Line from "@/components/ui/line";
import { useEventService } from "@/hooks/use-event-service";
import { useAllCommitteeInfor } from "@/hooks/use-committee";
import { useTaskService } from "@/hooks/use-task-service";

interface CreateCommitteeTaskFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const initialTags = [
  { label: "Quan trọng", color: "#F87171", textColor: "#fff" },
  { label: "Khẩn cấp", color: "#FBBF24", textColor: "#fff" },
  { label: "Bình thường", color: "#34D399", textColor: "#fff" },
];

export default function CreateCommitteeTaskForm({
  onCancel,
  onSuccess,
}: CreateCommitteeTaskFormProps) {
  const { events, loading: loadingEvents } = useEventService();
  const { data: committees, loading: loadingCommittees } = useAllCommitteeInfor();
  const { createTask, loading } = useTaskService();
  const [formData, setFormData] = useState({
    eventId: "",
    committeeId: "",
    title: "",
    tags: [] as typeof initialTags,
    description: "",
    startDate: "",
    deadline: "",
    assignee: "",
    percentComplete: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "percentComplete" ? Math.max(0, Math.min(100, Number(value))) : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTagToggle = (tag: typeof initialTags[0]) => {
    setFormData((prev) => {
      const exists = prev.tags.find((t) => t.label === tag.label);
      return {
        ...prev,
        tags: exists
          ? prev.tags.filter((t) => t.label !== tag.label)
          : [...prev.tags, tag],
      };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.eventId) newErrors.eventId = "Vui lòng chọn sự kiện";
    if (!formData.committeeId) newErrors.committeeId = "Vui lòng chọn ban";
    if (!formData.title.trim()) newErrors.title = "Tiêu đề nhiệm vụ là bắt buộc";
    if (!formData.startDate) newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    if (!formData.deadline) newErrors.deadline = "Hạn chót là bắt buộc";
    if (!formData.assignee.trim()) newErrors.assignee = "Người thực hiện là bắt buộc";
    if (formData.percentComplete < 0 || formData.percentComplete > 100)
      newErrors.percentComplete = "Phần trăm hoàn thành phải từ 0 đến 100";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await createTask({
        ...formData,
        eventId: Number(formData.eventId),
      });
      alert("Tạo nhiệm vụ thành công!");
      onSuccess();
    } catch (error) {
      alert("Tạo nhiệm vụ thất bại: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex">
          <span className="px-2 text-xl font-bold text-gray-800 border-r">
            Thông tin nhiệm vụ
          </span>
          <span className="px-2 text-xl font-bold text-gray-800">
            Chi tiết
          </span>
        </div>
        <div className="flex py-5 *:m-2">
          <div className="flex-2 bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] p-4">
            <form
              id="create-committee-task-form"
              onSubmit={handleSubmit}
              className="space-y-6 *:text-gray-800 [&_label]:text-xl"
            >
              {/* Event select */}
              <div>
                <label htmlFor="eventId" className="block text-xl font-medium mb-2">
                  Chọn sự kiện *
                </label>
                <select
                  id="eventId"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.eventId ? "border-red-500" : "border-gray-300"
                    }`}
                  disabled={loadingEvents}
                >
                  <option value="">-- Chọn sự kiện --</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
                {errors.eventId && (
                  <p className="mt-1 text-sm text-red-600">{errors.eventId}</p>
                )}
              </div>
              {/* Committee select */}
              <div>
                <label htmlFor="committeeId" className="block text-xl font-medium mb-2">
                  Chọn ban *
                </label>
                <select
                  id="committeeId"
                  name="committeeId"
                  value={formData.committeeId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.committeeId ? "border-red-500" : "border-gray-300"
                    }`}
                  disabled={loadingCommittees}
                >
                  <option value="">-- Chọn ban --</option>
                  {committees.map((committee) => (
                    <option key={committee.id} value={committee.id}>
                      {committee.name}
                    </option>
                  ))}
                </select>
                {errors.committeeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.committeeId}</p>
                )}
              </div>
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-xl font-medium mb-2">
                  Tiêu đề nhiệm vụ *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Nhập tiêu đề nhiệm vụ"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhãn nhiệm vụ
                </label>
                <div className="flex gap-2">
                  {initialTags.map((tag) => (
                    <button
                      type="button"
                      key={tag.label}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${formData.tags.find((t) => t.label === tag.label)
                        ? "border-transparent"
                        : "border-gray-300"
                        }`}
                      style={{
                        background: formData.tags.find((t) => t.label === tag.label)
                          ? tag.color
                          : "#fff",
                        color: formData.tags.find((t) => t.label === tag.label)
                          ? tag.textColor
                          : "#333",
                      }}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả nhiệm vụ
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nhập mô tả chi tiết..."
                />
              </div>
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày bắt đầu *
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.startDate ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
              {/* Deadline */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Hạn chót *
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.deadline ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                )}
              </div>
              {/* Assignee */}
              <div>
                <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-2">
                  Người thực hiện *
                </label>
                <input
                  type="text"
                  id="assignee"
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.assignee ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Nhập tên người thực hiện"
                />
                {errors.assignee && (
                  <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>
                )}
              </div>
              {/* Percent Complete */}
              <div>
                <label htmlFor="percentComplete" className="block text-sm font-medium text-gray-700 mb-2">
                  Phần trăm hoàn thành (%)
                </label>
                <input
                  type="number"
                  id="percentComplete"
                  name="percentComplete"
                  value={formData.percentComplete}
                  onChange={handleInputChange}
                  min={0}
                  max={100}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.percentComplete ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="0 - 100"
                />
                {errors.percentComplete && (
                  <p className="mt-1 text-sm text-red-600">{errors.percentComplete}</p>
                )}
              </div>
            </form>
          </div>
          <div className="p-5 text-gray-800 flex-1 bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] font-inter">
            <div className="text-xl">Xuất bản</div>
            <Line />
            <div className="text-sm my-1">
              Tiêu đề: <span className="text-sfit-green">{formData.title}</span>
            </div>
            <div className="text-sm my-1">
              Ban:{" "}
              <span className="text-sfit-green">
                {committees.find((c) => String(c.id) === formData.committeeId)?.name || ""}
              </span>
            </div>
            <div className="text-sm my-1">
              Nhãn:{" "}
              {formData.tags.map((tag) => (
                <span
                  key={tag.label}
                  className="inline-block px-2 py-1 rounded-full mx-1"
                  style={{ background: tag.color, color: tag.textColor }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
            <div className="text-sm my-1">
              Người thực hiện: <span className="text-sfit-green">{formData.assignee}</span>
            </div>
            <div className="text-sm my-1">
              Ngày bắt đầu: <span className="text-sfit-green">{formData.startDate}</span>
            </div>
            <div className="text-sm my-1">
              Hạn chót: <span className="text-sfit-green">{formData.deadline}</span>
            </div>
            <div className="text-sm my-1">
              Hoàn thành: <span className="text-sfit-green">{formData.percentComplete}%</span>
            </div>
            <div className="text-sm my-1">
              Mô tả: <span className="text-sfit-green">{formData.description}</span>
            </div>
            <Line />
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="text-sm px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="create-committee-task-form"
                className="text-sm px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tạo nhiệm vụ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}