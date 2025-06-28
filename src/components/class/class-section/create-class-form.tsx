"use client";
import { useState, useRef, useEffect } from "react";
import { useClassManagement } from "@/hooks/use-class-service";
import Line from "@/components/ui/line";

interface CreateClassFormProps {
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
              id="create-class-form"
              onSubmit={handleSubmit}
              className="space-y-6 *:text-gray-800 [&_label]:text-xl [&_label]:text-left"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-xl font-medium  mb-2"
                >
                  Tên lớp học *
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

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Chi tiết về lớp học
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nhập các yêu cầu, lưu ý cho người tham dự..."
                />
              </div>

              <div>
                <label
                  htmlFor="teacher"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Giảng viên *
                </label>
                <input
                  type="text"
                  id="teacher"
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.teacher ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập tên giảng viên"
                  required
                />
                {errors.teacher && (
                  <p className="mt-1 text-sm text-red-600">{errors.teacher}</p>
                )}
              </div>

              {/* Schedule */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div>
                    <label
                      htmlFor="scheduleStartTime"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Giờ bắt đầu *
                    </label>
                    <input
                      type="time"
                      id="scheduleStartTime"
                      name="scheduleStartTime"
                      value={formData.scheduleStartTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.scheduleStartTime
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    />
                    {errors.scheduleStartTime && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.scheduleStartTime}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="scheduleEndTime"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Giờ kết thúc *
                    </label>
                    <input
                      type="time"
                      id="scheduleEndTime"
                      name="scheduleEndTime"
                      value={formData.scheduleEndTime}
                      onChange={handleInputChange}
                      className={`w-fit px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.scheduleEndTime
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    />
                    {errors.scheduleEndTime && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.scheduleEndTime}
                      </p>
                    )}
                  </div>
                </div>
                <div className="relative" ref={dayDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày trong tuần *
                  </label>
                  <div
                    className="w-full px-4 py-3 border rounded-lg bg-white cursor-pointer"
                    onClick={() => setDayDropdownOpen((open) => !open)}
                  >
                    {formData.scheduleDays.length
                      ? formData.scheduleDays.join(", ")
                      : "Chọn ngày"}
                  </div>
                  {dayDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow p-2">
                      {daysOfWeek.map((day) => (
                        <label
                          key={day}
                          className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded"
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.scheduleDays}
                    </p>
                  )}
                </div>
              </div>

              {/* Date Range */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng thời gian học *
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-base mx-2">Từ</span>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <span className="text-base mx-2">Đến</span>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startDate}
                  </p>
                )}
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
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
                Thời gian tổ chức lớp:{" "}
                <span className="text-sfit-green">
                  {formatDate(formData.startDate)} -{" "}
                  {formatDate(formData.endDate)}
                </span>
              </div>
              <div className="text-sm my-1">
                Địa điểm:{" "}
                <span className="text-sfit-green"> {formData.address}</span>
              </div>
              <div className="text-sm my-1">
                Lịch học:{" "}
                <span className="text-sfit-green">
                  {formData.scheduleDays.join(", ")}{" "}
                  {formData.scheduleStartTime}-{formData.scheduleEndTime}
                </span>
              </div>
              <div className="text-sm my-1">
                Giảng viên:{" "}
                <span className="text-sfit-green"> {formData.teacher}</span>
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
                form="create-class-form"
                type="submit"
                disabled={loading}
                className="text-sm px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang tạo..." : "Tạo lớp học"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
