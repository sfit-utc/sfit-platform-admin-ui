"use client";
import { useState, useRef, useEffect } from "react";
import { useClassManagement } from "@/hooks/use-class-service";
import Line from "@/components/ui/line";
import Modal from "@/components/ui/modal";

interface CreateClassFormProps {
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

export default function CreateClassForm({
  state,
  funcClickToBack,
  onCancel,
  onSuccess,
}: CreateClassFormProps) {
  const { createClass, loading } = useClassManagement();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teacher: "",
    startDate: "",
    endDate: "",
    scheduleStartTime: "",
    scheduleEndTime: "",
    scheduleDays: [] as string[],
    address: "",
    status: "upcoming" as "ongoing" | "upcoming" | "past",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false);
  const dayDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dayDropdownRef.current &&
        !dayDropdownRef.current.contains(event.target as Node)
      ) {
        setDayDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysOfWeek = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDayCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      scheduleDays: checked
        ? [...prev.scheduleDays, value]
        : prev.scheduleDays.filter((day) => day !== value),
    }));
    if (errors.scheduleDays) {
      setErrors((prev) => ({ ...prev, scheduleDays: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Tên lớp là bắt buộc";
    if (!formData.teacher.trim()) newErrors.teacher = "Giảng viên là bắt buộc";
    if (!formData.startDate) newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    if (!formData.endDate) newErrors.endDate = "Ngày kết thúc là bắt buộc";
    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    if (!formData.scheduleStartTime)
      newErrors.scheduleStartTime = "Giờ bắt đầu là bắt buộc";
    if (!formData.scheduleEndTime)
      newErrors.scheduleEndTime = "Giờ kết thúc là bắt buộc";
    if (!formData.scheduleDays.length)
      newErrors.scheduleDays = "Chọn ít nhất một ngày học";
    if (!formData.address.trim()) newErrors.address = "Địa điểm là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await createClass({
        ...formData,
        schedule: `${formData.scheduleDays.join(", ")} ${
          formData.scheduleStartTime
        }-${formData.scheduleEndTime}`,
        time: `${formatDate(formData.startDate)} - ${formatDate(
          formData.endDate
        )}`,
      });
      alert("Tạo lớp học thành công!");
      onSuccess();
    } catch (error) {
      alert(
        "Tạo lớp học thất bại: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <Modal
      state={state}
      funcClickToBack={funcClickToBack}
      className="max-w-2xl w-4/5"
    >
      <div style={{ color: "var(--foreground)" }}>
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
          <form
            id="create-class-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-5"
            style={{ color: "var(--foreground)" }}
          >
            {/* Row 1: Tên lớp học | Giờ bắt đầu */}
            <div>
              <label
                htmlFor="title"
                className="block text-xl font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Tên lớp học *
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
                htmlFor="scheduleStartTime"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Giờ bắt đầu *
              </label>
              <input
                type="time"
                id="scheduleStartTime"
                name="scheduleStartTime"
                value={formData.scheduleStartTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: errors.scheduleStartTime
                    ? "var(--sfit-red-500)"
                    : "var(--sfit-gray-200)",
                }}
                required
              />
              {errors.scheduleStartTime && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errors.scheduleStartTime}
                </p>
              )}
            </div>

            {/* Row 2: Chi tiết về lớp học | Giờ kết thúc */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Chi tiết về lớp học
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
                placeholder="Nhập các yêu cầu, lưu ý cho người tham dự..."
              />
            </div>
            <div>
              <label
                htmlFor="scheduleEndTime"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Giờ kết thúc *
              </label>
              <input
                type="time"
                id="scheduleEndTime"
                name="scheduleEndTime"
                value={formData.scheduleEndTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: errors.scheduleEndTime
                    ? "var(--sfit-red-500)"
                    : "var(--sfit-gray-200)",
                }}
                required
              />
              {errors.scheduleEndTime && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errors.scheduleEndTime}
                </p>
              )}
            </div>

            {/* Row 3: Giảng viên | Ngày trong tuần */}
            <div>
              <label
                htmlFor="teacher"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Giảng viên *
              </label>
              <input
                type="text"
                id="teacher"
                name="teacher"
                value={formData.teacher}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: errors.teacher
                    ? "var(--sfit-red-500)"
                    : "var(--sfit-gray-200)",
                }}
                placeholder="Nhập tên giảng viên"
                required
              />
              {errors.teacher && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errors.teacher}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Ngày trong tuần *
              </label>
              <div
                className="w-full px-4 py-3 border rounded-lg bg-white cursor-pointer"
                onClick={() => setDayDropdownOpen((open) => !open)}
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--sfit-gray-200)",
                }}
              >
                {formData.scheduleDays.length
                  ? formData.scheduleDays.join(", ")
                  : "Chọn ngày"}
              </div>
              {dayDropdownOpen && (
                <div
                  className="absolute w-44 z-10 mt-1 border rounded shadow p-2"
                  style={{
                    backgroundColor: "var(--search-bg)",
                  }}
                >
                  {daysOfWeek.map((day) => (
                    <label
                      key={day}
                      className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded"
                      style={{ color: "var(--foreground)" }}
                    >
                      <input
                        type="checkbox"
                        value={day}
                        checked={formData.scheduleDays.includes(day)}
                        onChange={handleDayCheckboxChange}
                        className="accent-green-600"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              )}
              {errors.scheduleDays && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errors.scheduleDays}
                </p>
              )}
            </div>

            {/* Row 4: Khoảng thời gian học | Địa điểm */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Khoảng thời gian học *
              </label>
              <div className="flex flex-col  gap-4">
                <div className="flex items-center">
                  <span
                    className="text-base mx-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    Từ
                  </span>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: errors.startDate
                        ? "var(--sfit-red-500)"
                        : "var(--sfit-gray-200)",
                    }}
                    required
                  />
                </div>
                <div className="flex items-center">
                  <span
                    className="text-base mx-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    Đến
                  </span>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      borderColor: errors.endDate
                        ? "var(--sfit-red-500)"
                        : "var(--sfit-gray-200)",
                    }}
                    required
                  />
                </div>
              </div>
              {errors.startDate && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errors.startDate}
                </p>
              )}
              {errors.endDate && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errors.endDate}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Địa điểm *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: errors.address
                    ? "var(--sfit-red-500)"
                    : "var(--sfit-gray-200)",
                }}
                placeholder="Nhập địa điểm diễn ra sự kiện"
              />
              {errors.address && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--sfit-red-500)" }}
                >
                  {errors.address}
                </p>
              )}
            </div>
          </form>
        </div>
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
            form="create-class-form"
            className="text-sm px-4 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--sfit-green)",
              color: "var(--background)",
            }}
          >
            Tạo lớp học
          </button>
        </div>
      </div>
    </Modal>
  );
}
