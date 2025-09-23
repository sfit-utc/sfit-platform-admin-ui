"use client";
import Modal from "@/components/ui/modal";
import { useMember, useMemberManagement } from "@/hooks/use-member-service";
export default function DeleteModal({
  open,
  onClose,
  memberId,
  onDeleted,
}) {
  const { data: member } = useMember(memberId);
  const { deleteMember, loading } = useMemberManagement();

  const handleDelete = async () => {
    const ok = await deleteMember(String(memberId));
    if (ok) {
      if (onDeleted) onDeleted();
      onClose();
    }
  };

  return (
    <Modal
      state={open}
      funcClickToBack={() => onClose()}
      className="w-full max-w-md"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.75 6a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 1.5 0V8.25Zm-1 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold" style={{ color: "var(--sfit-red-500)" }}>
              Xóa quyền & ban của thành viên
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Thao tác này sẽ gỡ <b>{member?.name || "thành viên"}</b> khỏi tất cả các ban và xóa mọi vai trò. Hành động không thể hoàn tác.
            </p>
          </div>
        </div>

        {member && (
          <div className="rounded-md border p-3" style={{ borderColor: "var(--sfit-gray-200)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                {(member.name || "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{member.name || "Chưa có tên"}</div>
                <div className="text-xs text-gray-500 truncate">{member.email || "Không có email"}</div>
              </div>
            </div>
            {Array.isArray(member.teams) && member.teams.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {member.teams.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-xs text-gray-500">Thành viên chưa thuộc ban nào</div>
            )}
          </div>
        )}

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
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-60 flex items-center gap-2"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Xóa
          </button>
        </div>
      </div>
    </Modal>
  );
}