"use client";
import { useState } from "react";
import { useEventService } from "@/hooks/use-event-service";
import { EventStatus } from "@/types/event";
import Line from "@/components/ui/line";
import Modal from "@/components/ui/modal";

interface CreateEventFormProps {
  state: boolean;
  funcClickToBack: (b: boolean) => void;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CreateEventForm({
  state,
  funcClickToBack,
  onCancel,
  onSuccess,
}: CreateEventFormProps) {
  const { createEvent, loading } = useEventService();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    priority: 1,
    location: "",
    maxPeople: 1,
    agency: "",
    status: "UPCOMING" as EventStatus,
    beginAt: "",
    endAt: "",
    tags: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "priority" || name === "maxPeople"
          ? parseInt(value) || 1
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Tiêu đề là bắt buộc";
    if (!formData.type.trim()) newErrors.type = "Loại sự kiện là bắt buộc";
    if (!formData.description.trim()) newErrors.description = "Mô tả là bắt buộc";
    if (!formData.location.trim()) newErrors.location = "Địa điểm là bắt buộc";
    if (!formData.agency.trim()) newErrors.agency = "Đơn vị tổ chức là bắt buộc";
    if (!formData.beginAt) newErrors.beginAt = "Thời gian bắt đầu là bắt buộc";
    if (!formData.endAt) newErrors.endAt = "Thời gian kết thúc là bắt buộc";
    if (formData.maxPeople <= 0) newErrors.maxPeople = "Số lượng phải > 0";
    if (formData.priority <= 0) newErrors.priority = "Độ ưu tiên phải > 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await createEvent(formData);
      alert("Tạo sự kiện thành công!");
      onSuccess();
    } catch (error) {
      alert(
        "Tạo sự kiện thất bại: " +
        (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  // ...existing code...
  return (
    <Modal
      state={state}
      funcClickToBack={funcClickToBack}
      className="max-w-2xl min-w-4/5"
    >
      <div 
        style={{ color: "var(--foreground)" }}
        className="max-h-[90vh] overflow-y-auto"
      >
        <div
          className="rounded-lg shadow-lg p-6"
          style={{ backgroundColor: "var(--background)" }}
        >
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
          <div className="flex py-5 *:m-2">
            <div
              className="flex-5 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] p-4"
              style={{ backgroundColor: "var(--background)" }}
            >
              <form
                id="create-event-form"
                onSubmit={handleSubmit}
                className="space-y-6 flex flex-col gap-5"
                style={{ color: "var(--foreground)" }}
              >
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-xl font-medium mb-2"
                  >
                    Tiêu đề sự kiện *
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
                    placeholder="Nhập tiêu đề sự kiện"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm" style={{ color: "var(--sfit-red-500)" }}>
                      {errors.title}
                    </p>
                  )}
                </div>
                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-2">
                    Loại sự kiện *
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: errors.type
                        ? "var(--sfit-red-500)"
                        : "var(--sfit-gray-200)",
                    }}
                    placeholder="Nhập loại sự kiện"
                  />
                  {errors.type && (
                    <p className="mt-1 text-sm" style={{ color: "var(--sfit-red-500)" }}>
                      {errors.type}
                    </p>
                  )}
                </div>
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: errors.description
                        ? "var(--sfit-red-500)"
                        : "var(--sfit-gray-200)",
                    }}
                    placeholder="Nhập mô tả sự kiện"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm" style={{ color: "var(--sfit-red-500)" }}>
                      {errors.description}
                    </p>
                  )}
                </div>
                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium mb-2">
                    Độ ưu tiên *
                  </label>
                  <input
                    type="number"
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    min={1}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: errors.priority
                        ? "var(--sfit-red-500)"
                        : "var(--sfit-gray-200)",
                    }}
                    placeholder="Nhập độ ưu tiên"
                  />
                  {errors.priority && (
                    <p className="mt-1 text-sm" style={{ color: "var(--sfit-red-500)" }}>
                      {errors.priority}
                    </p>
                  )}
                </div>
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    Địa điểm *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: errors.location
                        ? "var(--sfit-red-500)"
                        : "var(--sfit-gray-200)",
                    }}
                    placeholder="Nhập địa điểm diễn ra sự kiện"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm" style={{ color: "var(--sfit-red-500)" }}>
                      {errors.location}
                    </p>
                  )}
                </div>
                {/* Max People */}
                <div>
                  <label htmlFor="maxPeople" className="block text-sm font-medium mb-2">
                    Số lượng tham dự tối đa *
                  </label>
                  <input
                    type="number"
                    id="maxPeople"
                    name="maxPeople"
                    value={formData.maxPeople}
                    onChange={handleInputChange}
                    min={1}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: errors.maxPeople
                        ? "var(--sfit-red-500)"
                        : "var(--sfit-gray-200)",
                    }}
                    placeholder="Nhập số lượng tham dự tối đa"
                  />
                  {errors.maxPeople && (
                    <p className="mt-1 text-sm" style={{ color: "var(--sfit-red-500)" }}>
                      {errors.maxPeople}
                    </p>
                  )}
                </div>
                {/* Agency */}
                <div>
                  <label htmlFor="agency" className="block text-sm font-medium mb-2">
                    Đơn vị tổ chức *
                  </label>
                  <input
                    type="text"
                    id="agency"
                    name="agency"
                    value={formData.agency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: errors.agency
                        ? "var(--sfit-red-500)"
                        : "var(--sfit-gray-200)",
                    }}
                    placeholder="Nhập đơn vị tổ chức"
                  />
                  {errors.agency && (
                    <p className="mt-1 text-sm" style={{ color: "var(--sfit-red-500)" }}>
                      {errors.agency}
                    </p>
                  )}
                </div>
                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-2">
                    Trạng thái sự kiện *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: "var(--sfit-gray-200)",
                    }}
                  >
                    <option value="DRAFT">Nháp</option>
                    <option value="UPCOMING">Sắp diễn ra</option>
                    <option value="ONGOING">Đang diễn ra</option>
                    <option value="COMPLETED">Đã hoàn thành</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>
                {/* BeginAt */}
                <div>
                  <label htmlFor="beginAt" className="block text-sm font-medium mb-2">
                    Thời gian bắt đầu *
                  </label>
                  <input
                    type="datetime-local"
                    id="beginAt"
                    name="beginAt"
                    value={formData.beginAt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: errors.beginAt
                        ? "var(--sfit-red-500)"
                        : "var(--sfit-gray-200)",
                    }}
                  />
                  {errors.beginAt && (
                    <p className="mt-1 text-sm" style={{ color: "var(--sfit-red-500)" }}>
                      {errors.beginAt}
                    </p>
                  )}
                </div>
                {/* EndAt */}
                <div>
                  <label htmlFor="endAt" className="block text-sm font-medium mb-2">
                    Thời gian kết thúc *
                  </label>
                  <input
                    type="datetime-local"
                    id="endAt"
                    name="endAt"
                    value={formData.endAt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: errors.endAt
                        ? "var(--sfit-red-500)"
                        : "var(--sfit-gray-200)",
                    }}
                  />
                  {errors.endAt && (
                    <p className="mt-1 text-sm" style={{ color: "var(--sfit-red-500)" }}>
                      {errors.endAt}
                    </p>
                  )}
                </div>
                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-2">
                    Tags (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags.join(", ")}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean),
                      }))
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: "var(--sfit-gray-200)",
                    }}
                    placeholder="Ví dụ: tình nguyện, môi trường, giáo dục"
                  />
                </div>
                {/* Buttons */}
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
                    form="create-event-form"
                    disabled={loading}
                    className="text-sm px-4 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--sfit-green)",
                      color: "var(--background)",
                    }}
                  >
                    {loading ? "Đang tạo..." : "Tạo sự kiện"}
                  </button>
                </div>
              </form>
            </div>
            {/* Preview */}
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
                  {formData.title}
                </span>
              </div>
              <div className="text-sm my-1">
                Trạng thái:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.status}
                </span>
              </div>
              <div className="text-sm my-1">
                Loại sự kiện:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.type}
                </span>
              </div>
              <div className="text-sm my-1">
                Đơn vị tổ chức:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.agency}
                </span>
              </div>
              <div className="text-sm my-1">
                Thời gian bắt đầu:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.beginAt}
                </span>
              </div>
              <div className="text-sm my-1">
                Thời gian kết thúc:{" "}
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.endAt}
                </span>
              </div>
              <div className="text-sm my-1">
                Địa điểm:
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.location}
                </span>
              </div>
              <div className="text-sm my-1">
                Số lượng tham dự:
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.maxPeople}
                </span>
              </div>
              <div className="text-sm my-1">
                Độ ưu tiên:
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.priority}
                </span>
              </div>
              <div className="text-sm my-1">
                Tags:
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.tags.join(", ")}
                </span>
              </div>
              <div className="text-sm my-1">
                Mô tả:
                <span style={{ color: "var(--sfit-green)" }}>
                  {formData.description}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
  // ...existing code...
}
