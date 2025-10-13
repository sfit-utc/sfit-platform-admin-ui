"use client";

import { useAuth } from "@/hooks/use-auth";
import { useProfileService } from "@/hooks/use-profile-service";
import Loading from "@/components/ui/loading";
import Card from "@/components/ui/card";
import AvatarIcon from "@/assets/icons/user.svg";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { profileService } from "@/services/profile-service";
import Image from "next/image";
export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const { userProfile, profileLoading, profileError, refetch } =
    useProfileService(user?.id);
  const router = useRouter();

  // Form state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    class_name: "",
    khoa: "",
    phone: "",
    msv: "",
    introduction: "",
    social_link: {
      Github: "",
      Facebook: "",
      Instagram: "",
      LinkedIn: "",
    },
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when userProfile is loaded
  useEffect(() => {
    if (userProfile && !isEditMode) {
      setFormData({
        full_name: userProfile.full_name || "",
        class_name: userProfile.class_name || "",
        khoa: userProfile.khoa || "",
        phone: userProfile.phone || "",
        msv: userProfile.msv || "",
        introduction: userProfile.introduction || "",
        social_link: {
          Github: userProfile.social_link?.Github || "",
          Facebook: userProfile.social_link?.Facebook || "",
          Instagram: userProfile.social_link?.Instagram || "",
          LinkedIn: userProfile.social_link?.LinkedIn || "",
        },
      });
    }
  }, [userProfile, isEditMode]);

  // Set creating mode when user doesn't have profile
  useEffect(() => {
    if (
      (profileError && profileError.includes("404")) ||
      (!userProfile && !profileLoading)
    ) {
      setIsCreating(true);
    } else if (userProfile) {
      setIsCreating(false);
    }
  }, [profileError, userProfile, profileLoading]);

  // Early returns for loading and error states
  if (isLoading || profileLoading) return <Loading />;

  if (!user) {
    return (
      <div className="p-6" style={{ color: "var(--foreground)" }}>
        Bạn chưa đăng nhập.
      </div>
    );
  }

  // Form handling functions
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const socialKey = name.replace("social_", "");
      setFormData((prev) => ({
        ...prev,
        social_link: {
          ...prev.social_link,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.full_name.trim()) {
      errors.full_name = "Họ tên là bắt buộc";
    }

    if (!formData.class_name.trim()) {
      errors.class_name = "Lớp là bắt buộc";
    }

    if (!formData.khoa.trim()) {
      errors.khoa = "Khoa là bắt buộc";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại là bắt buộc";
    }

    if (!formData.msv.trim()) {
      errors.msv = "Mã sinh viên là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isCreating) {
        // Create new profile
        await profileService.createUserProfile({
          full_name: formData.full_name,
          class_name: formData.class_name,
          khoa: formData.khoa,
          phone: formData.phone,
          msv: formData.msv,
          introduction: formData.introduction,
          social_link: Object.fromEntries(
            Object.entries(formData.social_link).filter(([_, value]) =>
              value.trim()
            )
          ),
        });
        setIsCreating(false);
        await refetch();
      } else {
        // Update existing profile
        await profileService.updateUserProfile({
          id: userProfile!.id,
          full_name: formData.full_name,
          class_name: formData.class_name,
          khoa: formData.khoa,
          email: userProfile!.email,
          phone: formData.phone,
          msv: formData.msv,
          introduction: formData.introduction,
          social_link: Object.fromEntries(
            Object.entries(formData.social_link).filter(([_, value]) =>
              value.trim()
            )
          ),
        });
        setIsEditMode(false);
        await refetch();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setFormErrors({
        general: "Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
    } else {
      setIsEditMode(false);
      // Reset form data to original values
      if (userProfile) {
        setFormData({
          full_name: userProfile.full_name || "",
          class_name: userProfile.class_name || "",
          khoa: userProfile.khoa || "",
          phone: userProfile.phone || "",
          msv: userProfile.msv || "",
          introduction: userProfile.introduction || "",
          social_link: {
            Github: userProfile.social_link?.Github || "",
            Facebook: userProfile.social_link?.Facebook || "",
            Instagram: userProfile.social_link?.Instagram || "",
            LinkedIn: userProfile.social_link?.LinkedIn || "",
          },
        });
      }
    }
    setFormErrors({});
  };

  // Helper functions
  const handleChangePassword = () => {
    router.push("/profile/change-password");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Display data
  const displayName =
    userProfile?.full_name || `${user.firstName} ${user.lastName}`.trim();
  const displayEmail = userProfile?.email || user.email;

  return (
    <div className="p-6 space-y-6">
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>
              {isCreating
                ? "Tạo hồ sơ cá nhân"
                : isEditMode
                ? "Chỉnh sửa hồ sơ"
                : "Hồ sơ cá nhân"}
            </span>
            <div className="flex gap-2">
              {!isCreating && !isEditMode && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
                  style={{
                    borderColor: "var(--sfit-gray-200)",
                    color: "var(--foreground)",
                  }}
                >
                  Chỉnh sửa
                </button>
              )}
              <button
                onClick={handleChangePassword}
                className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
                style={{
                  borderColor: "var(--sfit-gray-200)",
                  color: "var(--foreground)",
                }}
              >
                Đổi mật khẩu
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md text-white text-sm"
                style={{ backgroundColor: "var(--sfit-red-500)" }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        }
      >
        {/* Show form for creating or editing */}
        {isCreating || isEditMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {formErrors.general && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{formErrors.general}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3
                className="text-lg font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Thông tin cơ bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ borderColor: "var(--sfit-gray-200)" }}
                    placeholder="Nhập họ và tên"
                  />
                  {formErrors.full_name && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.full_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ borderColor: "var(--sfit-gray-200)" }}
                    placeholder="Nhập số điện thoại"
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    Lớp *
                  </label>
                  <input
                    type="text"
                    name="class_name"
                    value={formData.class_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ borderColor: "var(--sfit-gray-200)" }}
                    placeholder="Nhập tên lớp"
                  />
                  {formErrors.class_name && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.class_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    Khoa *
                  </label>
                  <input
                    type="text"
                    name="khoa"
                    value={formData.khoa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ borderColor: "var(--sfit-gray-200)" }}
                    placeholder="Nhập tên khoa"
                  />
                  {formErrors.khoa && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.khoa}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    Mã sinh viên *
                  </label>
                  <input
                    type="text"
                    name="msv"
                    value={formData.msv}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ borderColor: "var(--sfit-gray-200)" }}
                    placeholder="Nhập mã sinh viên"
                  />
                  {formErrors.msv && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.msv}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Giới thiệu
                </label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                  placeholder="Giới thiệu về bản thân..."
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3
                className="text-lg font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Liên kết mạng xã hội
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.social_link).map(([platform, url]) => (
                  <div key={platform}>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      {platform}
                    </label>
                    <input
                      type="url"
                      name={`social_${platform}`}
                      value={url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      style={{ borderColor: "var(--sfit-gray-200)" }}
                      placeholder={`https://${platform.toLowerCase()}.com/username`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : isCreating
                  ? "Tạo hồ sơ"
                  : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          /* Show existing profile display */
          <>
            {/* Profile Header */}
            <div className="flex items-center gap-6 py-4">
              <Image
                src={user.avatar || AvatarIcon.src}
                alt={displayName}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1
                    className="text-2xl font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {displayName}
                  </h1>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: "var(--sfit-green-light)",
                      color: "var(--sfit-green)",
                    }}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="opacity-80 mb-1">{displayEmail}</div>
                {(userProfile?.class_name || userProfile?.khoa) && (
                  <div className="opacity-70 text-sm">
                    {userProfile?.class_name && (
                      <span>{userProfile.class_name}</span>
                    )}
                    {userProfile?.class_name && userProfile?.khoa && (
                      <span> - </span>
                    )}
                    {userProfile?.khoa && <span>{userProfile.khoa}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Introduction */}
            {userProfile?.introduction && (
              <div
                className="mt-4 p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70 mb-2">Giới thiệu</div>
                <div className="font-medium">{userProfile.introduction}</div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div
                className="p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70">Mã người dùng</div>
                <div className="font-medium">{userProfile?.id || user.id}</div>
              </div>
              <div
                className="p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70">Email</div>
                <div className="font-medium">{displayEmail}</div>
              </div>
              {userProfile?.phone && (
                <div
                  className="p-4 rounded border"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div className="text-sm opacity-70">Số điện thoại</div>
                  <div className="font-medium">{userProfile.phone}</div>
                </div>
              )}
              {userProfile?.class_name && (
                <div
                  className="p-4 rounded border"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div className="text-sm opacity-70">Lớp</div>
                  <div className="font-medium">{userProfile.class_name}</div>
                </div>
              )}
              {userProfile?.msv && (
                <div
                  className="p-4 rounded border"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div className="text-sm opacity-70">Mã sinh viên</div>
                  <div className="font-medium">{userProfile.msv}</div>
                </div>
              )}

              {/* Social Links */}
              <div
                className=" p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70 mb-3">
                  Liên kết mạng xã hội
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* GitHub */}
                  <a
                    href={userProfile?.social_link?.Github || "#"}
                    target={
                      userProfile?.social_link?.Github ? "_blank" : "_self"
                    }
                    rel={
                      userProfile?.social_link?.Github
                        ? "noopener noreferrer"
                        : ""
                    }
                    className={`p-2 rounded-lg transition-all ${
                      userProfile?.social_link?.Github
                        ? "hover:bg-gray-100 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{
                      filter: userProfile?.social_link?.Github
                        ? "none"
                        : "grayscale(100%)",
                    }}
                    title="GitHub"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href={userProfile?.social_link?.Facebook || "#"}
                    target={
                      userProfile?.social_link?.Facebook ? "_blank" : "_self"
                    }
                    rel={
                      userProfile?.social_link?.Facebook
                        ? "noopener noreferrer"
                        : ""
                    }
                    className={`p-2 rounded-lg transition-all ${
                      userProfile?.social_link?.Facebook
                        ? "hover:bg-gray-100 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{
                      filter: userProfile?.social_link?.Facebook
                        ? "none"
                        : "grayscale(100%)",
                    }}
                    title="Facebook"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href={userProfile?.social_link?.Instagram || "#"}
                    target={
                      userProfile?.social_link?.Instagram ? "_blank" : "_self"
                    }
                    rel={
                      userProfile?.social_link?.Instagram
                        ? "noopener noreferrer"
                        : ""
                    }
                    className={`p-2 rounded-lg transition-all ${
                      userProfile?.social_link?.Instagram
                        ? "hover:bg-gray-100 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{
                      filter: userProfile?.social_link?.Instagram
                        ? "none"
                        : "grayscale(100%)",
                    }}
                    title="Instagram"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={userProfile?.social_link?.LinkedIn || "#"}
                    target={
                      userProfile?.social_link?.LinkedIn ? "_blank" : "_self"
                    }
                    rel={
                      userProfile?.social_link?.LinkedIn
                        ? "noopener noreferrer"
                        : ""
                    }
                    className={`p-2 rounded-lg transition-all ${
                      userProfile?.social_link?.LinkedIn
                        ? "hover:bg-gray-100 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{
                      filter: userProfile?.social_link?.LinkedIn
                        ? "none"
                        : "grayscale(100%)",
                    }}
                    title="LinkedIn"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {userProfile && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div
                  className="p-4 rounded border text-center"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--sfit-blue-500)" }}
                  >
                    {userProfile.completed_course}
                  </div>
                  <div className="text-sm opacity-70">Khóa học hoàn thành</div>
                </div>
                <div
                  className="p-4 rounded border text-center"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--sfit-green-500)" }}
                  >
                    {userProfile.joined_event}
                  </div>
                  <div className="text-sm opacity-70">Sự kiện tham gia</div>
                </div>
                <div
                  className="p-4 rounded border text-center"
                  style={{ borderColor: "var(--sfit-gray-200)" }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--sfit-purple-500)" }}
                  >
                    {userProfile.completed_task}
                  </div>
                  <div className="text-sm opacity-70">Nhiệm vụ hoàn thành</div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div
                className="p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70">Ngày tạo</div>
                <div className="font-medium">
                  {userProfile?.created_at
                    ? formatDate(userProfile.created_at)
                    : user.createdAt}
                </div>
              </div>
              <div
                className="p-4 rounded border"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                <div className="text-sm opacity-70">Cập nhật gần nhất</div>
                <div className="font-medium">
                  {userProfile?.updated_at
                    ? formatDate(userProfile.updated_at)
                    : user.updatedAt}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
