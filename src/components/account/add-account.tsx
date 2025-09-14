import Modal from "@/components/ui/modal";
import { useState, useEffect } from "react";
import { accountService } from "@/services/account-service";

interface AddAccountProp {
  funcClickToBack: (b: boolean) => void;
  state: boolean;
  onAccountAdded?: () => void; // Callback to refresh account list
}

export default function AddAccount({
  state,
  funcClickToBack,
  onAccountAdded,
}: AddAccountProp) {
  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    class: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!state) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
        class: "",
      });
      setErrors({});
    }
  }, [state]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.role) {
      newErrors.role = "Vui lòng chọn vai trò";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Register the user first
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        class: formData.class,
      };

      const newUser = await accountService.createAccount(registerData);

      // Step 2: Add role to the newly created user
      if (newUser && newUser.id) {
        await accountService.updateUserRole(newUser.id, formData.role);
      }

      // Success - close modal and refresh list
      if (onAccountAdded) {
        onAccountAdded();
      }
      funcClickToBack(false);
    } catch (error: any) {
      console.error("Error creating account:", error);

      // Handle specific error cases
      if (error.message?.includes("email already exists")) {
        setErrors({ email: "Email đã tồn tại" });
      } else if (error.message?.includes("Failed to update user role")) {
        setErrors({
          general:
            "Tài khoản đã được tạo nhưng không thể cập nhật vai trò. Vui lòng thử lại.",
        });
      } else {
        setErrors({ general: "Có lỗi xảy ra khi tạo tài khoản" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      state={state}
      funcClickToBack={() => funcClickToBack(false)}
      className="w-2/3"
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <h2
          className="text-xl font-semibold mb-6"
          style={{ color: "var(--sfit-green)" }}
        >
          Tạo tài khoản mới
        </h2>

        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Họ và tên *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="Nhập họ và tên"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Mật khẩu *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Confirm Password Field */}

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                Vai trò *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
              >
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Class Field */}
            <div>
              <label htmlFor="class" className="block text-sm font-medium mb-2">
                Lớp
              </label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                placeholder="Nhập lớp (tùy chọn)"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => funcClickToBack(false)}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
