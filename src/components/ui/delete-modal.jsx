"use client";
import Modal from "@/components/ui/modal";
import { useMember, useMemberManagement } from "@/hooks/use-member-service";
export default function DeleteModal({
  open,
  onClose,
  memberId,
}) {
  const { data: member } = useMember(memberId);
  const { deleteMember, loading } = useMemberManagement();

  const handleDelete = async () => {
    const ok = await deleteMember(memberId);
    if (ok) onClose();
  };

  return (
    <Modal
      state={open}
      funcClickToBack={() => onClose()}
      className="w-full max-w-md"
    >
      <div className="space-y-4">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--sfit-red-500)" }}
        >
          Xóa thành viên
        </h2>
        <p>
          Bạn có chắc chắn muốn xóa thành viên{" "}
          {member?.name ? <b>{member.name}</b> : <b>này</b>}? Hành động này
          không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            style={{ borderColor: "var(--sfit-gray-200)" }}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-60"
            disabled={loading}
          >
            Xóa
          </button>
        </div>
      </div>
    </Modal>
  );
}