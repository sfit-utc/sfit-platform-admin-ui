import Modal from "@/components/ui/modal";
import { useState, useEffect } from "react";
import {
  useAccountManagement,
  useAvailableRoles,
} from "@/hooks/use-account-service";
import { useAuth } from "@/hooks/use-auth";

interface AccountEditModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string;
  currentRole: string;
  onSaved?: () => void;
}

export default function AccountEditModal({
  open,
  onClose,
  accountId,
  currentRole,
  onSaved,
}: AccountEditModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);
  const [error, setError] = useState<string | null>(null);
  const { updateAccountRole, removeAccountRole, loading } =
    useAccountManagement();
  const { data: availableRoles, loading: rolesLoading } = useAvailableRoles();
  const { user } = useAuth();

  // Update selected role when currentRole changes
  useEffect(() => {
    setSelectedRole(currentRole);
  }, [currentRole]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedRole(currentRole);
      setError(null);
    }
  }, [open, currentRole]);

  const handleSave = async () => {
    // Enforce admin-only editing
    if (!user || user.role !== "admin") {
      setError(
        "Chỉ quản trị viên (ADMIN) mới được chỉnh sửa thông tin tài khoản."
      );
      return;
    }

    try {
      setError(null);
      const uid = String(accountId);
      if (selectedRole === "admin") {
        await updateAccountRole(uid, "admin");
      } else {
        // Switch to user: ensure admin role is removed
        await removeAccountRole(uid, "admin");
      }

      if (onSaved) {
        onSaved();
      }
      onClose();
    } catch (error: any) {
      console.error("Error updating account role:", error);
      setError("Có lỗi xảy ra khi cập nhật vai trò");
    }
  };

  return (
    <Modal
      state={open}
      funcClickToBack={onClose}
      className="w-full max-w-md z-1000"
    >
      <div className="p-6">
        <h2
          className="text-xl font-semibold mb-6"
          style={{ color: "var(--sfit-green)" }}
        >
          Chỉnh sửa vai trò
        </h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Role Selection */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-medium mb-2">
            Vai trò *
          </label>
          {rolesLoading ? (
            <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50">
              <div className="animate-pulse">Đang tải...</div>
            </div>
          ) : (
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            >
              {availableRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading || rolesLoading}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
