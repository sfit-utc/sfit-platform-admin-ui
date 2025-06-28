"use client";
import { useState } from "react";
import { useEventService } from "@/hooks/use-event-service";
import Line from "@/components/ui/line";

interface CreateEventFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CreateEventForm({
  onCancel,
  onSuccess,
}: CreateEventFormProps) {
  const { createEvent, loading } = useEventService();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    address: "",
    participants: 0,
    requirements: "",
    status: "upcoming" as const,
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
      [name]: name === "participants" ? parseInt(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề sự kiện là bắt buộc";
    }

    if (!formData.date) {
      newErrors.date = "Ngày diễn ra là bắt buộc";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate < today) {
        newErrors.date = "Ngày diễn ra không thể là ngày trong quá khứ";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa điểm là bắt buộc";
    }

    if (formData.participants <= 0) {
      newErrors.participants = "Số lượng tham dự phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
              id="create-event-form"
              onSubmit={handleSubmit}
              className="space-y-6 *:text-gray-800 [&_label]:text-xl"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-xl font-medium  mb-2"
                >
                  Tiêu đề sự kiện *
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
                  placeholder="Nhập tiêu đề sự kiện"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label
                  htmlFor="requirements"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Yêu cầu về sự kiện
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nhập các yêu cầu, lưu ý cho người tham dự..."
                />
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ngày diễn ra *
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Địa điểm *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập địa điểm diễn ra sự kiện"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Participants */}
              <div>
                <label
                  htmlFor="participants"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Số lượng tham dự tối đa *
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
                  placeholder="Nhập số lượng tham dự tối đa"
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
                  Trạng thái sự kiện
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
            </form>
          </div>
          <div className="p-5 text-gray-800  flex-1 bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] font-inter">
            <div className="text-xl">Xuất bản</div>
            <Line />
            <div className="text-sm my-1">
              Tiêu đề:{" "}
              <span className="text-sfit-green"> {formData.title}</span>
            </div>
            <div className="text-sm my-1">
              Trạng thái:{" "}
              <span className="text-sfit-green"> {formData.status}</span>
            </div>
            <div className="text-sm my-1">Bản sửa đổi: </div>
            <Line />
            <div className="text-sm my-1">
              Thời gian tổ chức sự kiện: <br />
              <span className="text-sfit-green"> {formData.date}</span>
            </div>
            <div className="text-sm my-1">
              Địa điểm:
              <span className="text-sfit-green"> {formData.address}</span>
            </div>
            <div className="text-sm my-1">
              Số lượng tham dự:
              <span className="text-sfit-green"> {formData.participants}</span>
            </div>
            <div className="text-sm my-1">
              Yêu cầu:
              <span className="text-sfit-green"> {formData.requirements}</span>
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
                type="submit"
                form="create-event-form"
                disabled={loading}
                className="text-sm px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang tạo..." : "Tạo sự kiện"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
