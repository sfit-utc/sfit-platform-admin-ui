import React, { useState } from "react";
import Modal from "@/components/ui/modal";

interface AddTargetProp {
  funcClickToBack: (b: boolean) => void;
  state: boolean;
}

interface FormData {
  name: string;
  expired: string;
  isHead: boolean;
  isSecretary: boolean;
}

export default function AddTarget({ funcClickToBack, state }: AddTargetProp) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    expired: "",
    isHead: false,
    isSecretary: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    const value =
      field === "isHead" || field === "isSecretary"
        ? e.target.checked
        : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên mục tiêu";
    }
    if (!formData.expired.trim()) {
      newErrors.expired = "Vui lòng nhập hạn mục tiêu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      funcClickToBack(false);
    }
  };

  return (
    <Modal
      state={state}
      funcClickToBack={funcClickToBack}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Thêm Mục Tiêu</h2>

        <div>
          <label
            htmlFor="name-target"
            className="block text-sm font-medium text-gray-700"
          >
            Mục tiêu
          </label>
          <input
            type="text"
            name="name-target"
            id="name-target"
            value={formData.name}
            onChange={(e) => handleInputChange(e, "name")}
            className={`mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập tên mục tiêu"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="expired"
            className="block text-sm font-medium text-gray-700"
          >
            Hạn
          </label>
          <input
            type="date"
            name="expired"
            id="expired"
            value={formData.expired}
            onChange={(e) => handleInputChange(e, "expired")}
            className={`mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 ${
              errors.expired ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Chọn ngày hạn"
          />
          {errors.expired && (
            <p className="mt-1 text-sm text-red-500">{errors.expired}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="head"
              id="head"
              checked={formData.isHead}
              onChange={(e) => handleInputChange(e, "isHead")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="head" className="ml-2 text-sm text-gray-700">
              Trưởng/Phó ban
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="secretary"
              id="secretary"
              checked={formData.isSecretary}
              onChange={(e) => handleInputChange(e, "isSecretary")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="secretary" className="ml-2 text-sm text-gray-700">
              Thư ký
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => funcClickToBack(false)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Thêm
          </button>
        </div>
      </form>
    </Modal>
  );
}
