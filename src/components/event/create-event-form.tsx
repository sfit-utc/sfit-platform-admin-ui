"use client";
import { useState } from "react";
import { useEventService } from "@/hooks/use-event-service";
import Line from "@/components/ui/line";
import Modal from "@/components/ui/modal";
import { NewEventRequest } from "@/types/event";

interface CreateEventFormProps {
  state: boolean;
  funcClickToBack: (b: boolean) => void;
  onCancel: () => void;
  onSuccess: () => void;
}
const defaultFormData: NewEventRequest = {
  title: "",
  type: "",
  description: "",
  location: "",
  begin_at: "",
  end_at: "",
  max_people: 0,
  priority: 0,
  agency: "",
  tags: [],
  status: "UPCOMING",
};
export default function CreateEventForm({
  state,
  funcClickToBack,
  onCancel,
  onSuccess,
}: CreateEventFormProps) {
  const { createEvent, loading } = useEventService();

  const [formData, setFormData] = useState({
    ...defaultFormData,
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
        name === "max_people" || name === "priority"
          ? parseInt(value) || ""
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    setFormData((prev) => ({
      ...prev,
      tags,
    }));
  };

  // const validateForm = () => {
  //   const newErrors: Record<string, string> = {};

  //   if (!formData.title.trim()) {
  //     newErrors.title = "Tiêu đề sự kiện là bắt buộc";
  //   }

  //   if (!formData.date) {
  //     newErrors.date = "Ngày diễn ra là bắt buộc";
  //   } else {
  //     const selectedDate = new Date(formData.date);
  //     const today = new Date();
  //     if (selectedDate < today) {
  //       newErrors.date = "Ngày diễn ra không thể là ngày trong quá khứ";
  //     }
  //   }

  //   if (!formData.address.trim()) {
  //     newErrors.address = "Địa điểm là bắt buộc";
  //   }

  //   if (formData.participants <= 0) {
  //     newErrors.participants = "Số lượng tham dự phải lớn hơn 0";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Tiêu đề sự kiện là bắt buộc";
    if (!formData.begin_at)
      newErrors.begin_at = "Thời gian bắt đầu là bắt buộc";
    if (!formData.end_at) newErrors.end_at = "Thời gian kết thúc là bắt buộc";
    if (formData.begin_at && formData.end_at) {
      if (new Date(formData.end_at) < new Date(formData.begin_at)) {
        newErrors.end_at = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }
    }
    if (!formData.location.trim()) newErrors.location = "Địa điểm là bắt buộc";
    if (formData.max_people <= 0)
      newErrors.max_people = "Số lượng tham dự phải lớn hơn 0";
    if (!formData.status) newErrors.status = "Trạng thái là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const payload: NewEventRequest = {
        ...formData,
        begin_at: new Date(formData.begin_at).toISOString(),
        end_at: new Date(formData.end_at).toISOString(),
        tags: Array.isArray(formData.tags)
          ? formData.tags.map((t) => t.trim()).filter(Boolean)
          : [],
        max_people: Number(formData.max_people),
        priority: Number(formData.priority),
      };
      await createEvent(payload);
      alert("Tạo sự kiện thành công!");
      onSuccess();
    } catch (error) {
      alert(
        "Tạo sự kiện thất bại: " +
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
          className="rounded-lg shadow-lg p-6"
          style={{
            backgroundColor: "var(--background)",
            overflowY: "auto",
            maxHeight: "80vh",
          }}
        >
          <form
            id="create-event-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="title" className="block text-xl font-medium mb-2">
                Tiêu đề sự kiện *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg"
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
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Mô tả sự kiện
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
                  borderColor: "var(--sfit-gray-200)",
                }}
                placeholder="Nhập mô tả sự kiện"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-2"
              >
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
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errors.location}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="begin_at"
                  className="block text-sm font-medium mb-2"
                >
                  Thời gian bắt đầu *
                </label>
                <input
                  type="datetime-local"
                  id="begin_at"
                  name="begin_at"
                  value={formData.begin_at}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: errors.begin_at
                      ? "var(--sfit-red-500)"
                      : "var(--sfit-gray-200)",
                  }}
                />
                {errors.begin_at && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--sfit-red-500)" }}
                  >
                    {errors.begin_at}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="end_at"
                  className="block text-sm font-medium mb-2"
                >
                  Thời gian kết thúc *
                </label>
                <input
                  type="datetime-local"
                  id="end_at"
                  name="end_at"
                  value={formData.end_at}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    borderColor: errors.end_at
                      ? "var(--sfit-red-500)"
                      : "var(--sfit-gray-200)",
                  }}
                />
                {errors.end_at && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--sfit-red-500)" }}
                  >
                    {errors.end_at}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="max_people"
                className="block text-sm font-medium mb-2"
              >
                Số lượng tham dự tối đa *
              </label>
              <input
                type="number"
                id="max_people"
                name="max_people"
                value={formData.max_people}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-3 border rounded-lg"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: errors.max_people
                    ? "var(--sfit-red-500)"
                    : "var(--sfit-gray-200)",
                }}
                placeholder="Nhập số lượng tham dự tối đa"
              />
              {errors.max_people && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errors.max_people}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2">
                Loại sự kiện
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
                  borderColor: "var(--sfit-gray-200)",
                }}
                placeholder="Nhập loại sự kiện"
              />
            </div>
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium mb-2"
              >
                Độ ưu tiên
              </label>
              <input
                type="number"
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border rounded-lg"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
                placeholder="Nhập độ ưu tiên"
              />
            </div>
            <div>
              <label
                htmlFor="agency"
                className="block text-sm font-medium mb-2"
              >
                Đơn vị tổ chức
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
                  borderColor: "var(--sfit-gray-200)",
                }}
                placeholder="Nhập đơn vị tổ chức"
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2">
                Tags (cách nhau bởi dấu phẩy)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                onChange={handleTagsChange}
                autoComplete="off"
                className="w-full px-4 py-3 border rounded-lg"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
                placeholder="Ví dụ: tình nguyện, học thuật"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-2"
              >
                Trạng thái sự kiện *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                className="w-full px-4 py-3 border rounded-lg"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: errors.status
                    ? "var(--sfit-red-500)"
                    : "var(--sfit-gray-200)",
                }}
              >
                <option value="UPCOMING">Sắp diễn ra</option>
                <option value="ONGOING">Đang diễn ra</option>
              </select>
              {errors.status && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errors.status}
                </p>
              )}
            </div>
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
      </div>
    </Modal>
  );
}
