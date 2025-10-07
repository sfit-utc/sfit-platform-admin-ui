"use client";
import { useState, useRef, useEffect } from "react";
import { useCourseService } from "@/hooks/use-course-service";
import Modal from "@/components/ui/modal";
import { CreateCourseRequest} from "@/types/course";

interface CreateCourseFormProps {
  state: boolean;
  funcClickToBack: (b: boolean) => void;
  onCancel: () => void;
  onSuccess: () => void;
}

// Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
// function formatDate(dateStr: string) {
//   if (!dateStr) return "";
//   const [year, month, day] = dateStr.split("-");
//   return `${day}/${month}/${year}`;
// }

export default function CreateClassForm({
  state,
  funcClickToBack,
  onCancel,
  onSuccess,
}: CreateCourseFormProps) {
  // const [formData, setFormData] = useState({
  //   title: "",
  //   description: "",
  //   teacher: "",
  //   startDate: "",
  //   endDate: "",
  //   scheduleStartTime: "",
  //   scheduleEndTime: "",
  //   scheduleDays: [] as string[],
  //   address: "",
  //   status: "upcoming" as "ongoing" | "upcoming" | "past",
  // });
  const { createCourse, loading } = useCourseService();
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({
    teachers: "",
    tags: "",
    targets: "",
    requires: "",
  });
  const [formData, setFormData] = useState<CreateCourseRequest>({
    title: "",
    description: "",
    type: "offline",
    teachers: [],
    language: "Vietnamese",
    certificate: false,
    level: "Beginner",
    tags: [],
    targets: [],
    requires: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [dayDropdownOpen, setDayDropdownOpen] = useState(false);
  const dayDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dayDropdownRef.current &&
        !dayDropdownRef.current.contains(event.target as Node)
      ) {
        // setDayDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const daysOfWeek = [
  //   "Thứ 2",
  //   "Thứ 3",
  //   "Thứ 4",
  //   "Thứ 5",
  //   "Thứ 6",
  //   "Thứ 7",
  //   "Chủ nhật",
  // ];

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

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof CreateCourseRequest
  ) => {
    const { value } = e.target;
    setRawInputs((prev) => ({
      ...prev,
      [fieldName]: value, // Lưu giá trị thô
    }));
  };
  const handleArrayInputBlur = (fieldName: keyof CreateCourseRequest) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: rawInputs[fieldName]
        .split(",") // Tách chuỗi bằng dấu phẩy
        .map((item) => item.trim()) // Loại bỏ khoảng trắng thừa ở đầu và cuối
        .filter((item) => item), // Loại bỏ các chuỗi rỗng
    }));
  };
  // const validateForm = () => {
  //   const newErrors: Record<string, string> = {};
  //   if (!formData.title.trim()) newErrors.title = "Tên lớp là bắt buộc";
  //   if (!formData.teacher.trim()) newErrors.teacher = "Giảng viên là bắt buộc";
  //   if (!formData.startDate) newErrors.startDate = "Ngày bắt đầu là bắt buộc";
  //   if (!formData.endDate) newErrors.endDate = "Ngày kết thúc là bắt buộc";
  //   if (
  //     formData.startDate &&
  //     formData.endDate &&
  //     formData.endDate < formData.startDate
  //   ) {
  //     newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
  //   }
  //   if (!formData.scheduleStartTime)
  //     newErrors.scheduleStartTime = "Giờ bắt đầu là bắt buộc";
  //   if (!formData.scheduleEndTime)
  //     newErrors.scheduleEndTime = "Giờ kết thúc là bắt buộc";
  //   if (!formData.scheduleDays.length)
  //     newErrors.scheduleDays = "Chọn ít nhất một ngày học";
  //   if (!formData.address.trim()) newErrors.address = "Địa điểm là bắt buộc";
  //   if (!formData.description.trim())
  //     newErrors.description = "Mô tả là bắt buộc";
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Tên lớp là bắt buộc";
    if (!formData.teachers?.length) newErrors.teachers = "Giảng viên là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createCourse(formData);
      alert("Tạo lớp học thành công!");
      onSuccess();
    } catch (error) {
      alert(
        "Tạo lớp học thất bại: " +
        (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;
  //   try {
  //     await createClass({
  //       ...formData,
  //       schedule: `${formData.scheduleDays.join(", ")} ${
  //         formData.scheduleStartTime
  //       }-${formData.scheduleEndTime}`,
  //       time: `${formatDate(formData.startDate)} - ${formatDate(
  //         formData.endDate
  //       )}`,
  //     });
  //     alert("Tạo lớp học thành công!");
  //     onSuccess();
  //   } catch (error) {
  //     alert(
  //       "Tạo lớp học thất bại: " +
  //         (error instanceof Error ? error.message : "Unknown error")
  //     );
  //   }
  // };

  return (
    <Modal
      state={state}
      funcClickToBack={funcClickToBack}
      className="max-w-2xl w-4/5 overflow-y-auto max-h-[80vh]"
    >
      <div style={{ color: "var(--foreground)" }}>
        <form
          id="create-course-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-5"
          style={{ color: "var(--foreground)" }}
        >
          {/* Title */}
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

          {/* Description */}
          <div className="col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Mô tả lớp học *
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
                borderColor: errors.description
                  ? "var(--sfit-red-500)"
                  : "var(--sfit-gray-200)",
              }}
              placeholder="Nhập mô tả lớp học"
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

          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Loại khóa học *
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: errors.type
                  ? "var(--sfit-red-500)"
                  : "var(--sfit-gray-200)",
              }}
              placeholder="Nhập loại khóa học (ví dụ: Web Development)"
            />
            {errors.type && (
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--sfit-red-500)" }}
              >
                {errors.type}
              </p>
            )}
          </div>

          {/* Teachers */}
          <div>
            <label
              htmlFor="teachers"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Giảng viên *
            </label>
            <input
              type="text"
              id="teachers"
              name="teachers"
              value={rawInputs.teachers} // Hiển thị giá trị thô
              onChange={(e) => handleArrayInputChange(e, "teachers")}
              onBlur={() => handleArrayInputBlur("teachers")} // Xử lý khi rời khỏi input
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: errors.teachers
                  ? "var(--sfit-red-500)"
                  : "var(--sfit-gray-200)",
              }}
              placeholder="Nhập tên giảng viên (cách nhau bởi dấu phẩy)"
            />
            {errors.teachers && (
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--sfit-red-500)" }}
              >
                {errors.teachers}
              </p>
            )}
          </div>

          {/* Targets */}
          <div className="col-span-2">
            <label
              htmlFor="targets"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Mục tiêu khóa học
            </label>
            <input
              type="text"
              id="targets"
              name="targets"
              value={rawInputs.targets}
              onChange={(e) => handleArrayInputChange(e, "targets")}
              onBlur={() => handleArrayInputBlur("targets")}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--sfit-gray-200)",
              }}
              placeholder="Nhập mục tiêu khóa học (phân cách bằng dấu phẩy)"
            />
          </div>

          {/* Requires */}
          <div className="col-span-2">
            <label
              htmlFor="requires"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Yêu cầu đầu vào
            </label>
            <input
              type="text"
              id="requires"
              name="requires"
              value={rawInputs.requires}
              onChange={(e) => handleArrayInputChange(e, "requires")}
              onBlur={() => handleArrayInputBlur("requires")}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--sfit-gray-200)",
              }}
              placeholder="Nhập yêu cầu đầu vào (phân cách bằng dấu phẩy)"
            />
          </div>

          {/* Language */}
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Ngôn ngữ *
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--sfit-gray-200)",
              }}
            >
              <option value="Vietnamese">Tiếng Việt</option>
              <option value="English">Tiếng Anh</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label
              htmlFor="level"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Cấp độ *
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--sfit-gray-200)",
              }}
            >
              <option value="Beginner">Cơ bản</option>
              <option value="Intermediate">Trung cấp</option>
              <option value="Advanced">Nâng cao</option>
            </select>
          </div>

          {/* Certificate */}
          <div>
            <label
              htmlFor="certificate"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Chứng chỉ
            </label>
            <input
              type="checkbox"
              id="certificate"
              name="certificate"
              checked={formData.certificate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  certificate: e.target.checked,
                }))
              }
              className="w-4 h-4 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--sfit-gray-200)",
              }}
            />
          </div>

          {/* Tags */}
          <div className="col-span-2">
            <label
              htmlFor="tags"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={rawInputs.tags} // Hiển thị giá trị thô
              onChange={(e) => handleArrayInputChange(e, "tags")}
              onBlur={() => handleArrayInputBlur("tags")} // Xử lý khi rời khỏi input
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--sfit-gray-200)",
              }}
              placeholder="Nhập tags (phân cách bằng dấu phẩy)"
            />
          </div>

          {/* Submit Buttons */}
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
              form="create-course-form"
              className="text-sm px-4 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--sfit-green)",
                color: "var(--background)",
              }}
              disabled={loading}
            >
              {loading ? "Đang tạo..." : "Tạo lớp học"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}