import Modal from "@/components/ui/modal";
import { useState } from "react";
import { useAccountManagement } from "@/hooks/use-account-service";

interface AccountDeleteModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string;
  accountName?: string;
  onDeleted?: () => void;
}

export default function AccountDeleteModal({
  open,
  onClose,
  accountId,
  accountName,
  onDeleted,
}: AccountDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deleteAccount } = useAccountManagement();

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteAccount(String(accountId));

      if (onDeleted) {
        onDeleted();
      }
      onClose();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setError("Có lỗi xảy ra khi xóa tài khoản");
    } finally {
      setLoading(false);
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
          className="text-xl font-semibold mb-4"
          style={{ color: "var(--sfit-red)" }}
        >
          Xóa tài khoản
        </h2>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Bạn có chắc chắn muốn xóa tài khoản này không?
          </p>
          {accountName && (
            <p className="font-medium text-gray-900">
              Tài khoản: {accountName}
            </p>
          )}
          <p className="text-sm text-red-600 mt-2">
            ⚠️ Hành động này không thể hoàn tác!
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

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
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa tài khoản"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
