"use client";
import Modal from "@/components/ui/modal";
import { useMember } from "@/hooks/use-member-service";
import Avatar from "@/assets/icons/user.svg";

export default function DetailModal({
  open,
  onClose,
  memberId,
}: {
  open: boolean;
  onClose: () => void;
  memberId: number;
}) {
  const { data: member, loading } = useMember(memberId);
  return (
    <Modal
      state={open}
      funcClickToBack={() => onClose()}
      className="w-full max-w-xl"
    >
      <div className="space-y-4">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--sfit-green)" }}
        >
          Thông tin thành viên
        </h2>
        {loading || !member ? (
          <div>Đang tải...</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <img
                src={member.avatar || Avatar.src}
                alt={member.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <div className="text-lg font-bold">{member.name}</div>
                <div className="text-sm opacity-80">Mã: {member.id}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm opacity-70">Chức vụ</div>
                <div className="font-medium">{member.role}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Lớp</div>
                <div className="font-medium">{member.class}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Email</div>
                <div className="font-medium">{member.email || "—"}</div>
              </div>
              <div>
                <div className="text-sm opacity-70">Trạng thái</div>
                <div className="font-medium">{member.status || "—"}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm opacity-70">Ban</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {member.teams?.map((t: string) => (
                    <span
                      key={t}
                      className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-sm opacity-70">Ngày tham gia</div>
                <div className="font-medium">{member.joinDate || "—"}</div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                style={{ borderColor: "var(--sfit-gray-200)" }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
