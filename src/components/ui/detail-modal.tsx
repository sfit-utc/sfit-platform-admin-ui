"use client";
import Modal from "@/components/ui/modal";
import { useMember } from "@/hooks/use-member-service";
import { memberService } from "@/services/member-service";
import Avatar from "@/assets/icons/user.svg";
import { useState, useEffect } from "react";

export default function DetailModal({
  open,
  onClose,
  memberId,
}: {
  open: boolean;
  onClose: () => void;
  memberId: string;
}) {
  const { data: member, loading } = useMember(memberId);
  const [activeTeam, setActiveTeam] = useState<string>("");
  const [displayRole, setDisplayRole] = useState<string>("");

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "Chủ nhiệm":
        return "text-purple-600 font-bold bg-purple-100";
      case "Phó CN":
        return "text-pink-500 font-semibold bg-pink-100";
      case "Trưởng ban":
        return "text-red-600 font-bold bg-red-100";
      case "Phó ban":
        return "text-orange-500 font-semibold bg-orange-100";
      case "Thành viên":
        return "text-green-700 bg-green-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  useEffect(() => {
    if (member && open) {
      setActiveTeam(member.teams?.[0] || "");
      setDisplayRole(member.role || "Thành viên");
    }
  }, [member, open]);

  useEffect(() => {
    const fetchRole = async () => {
      if (!activeTeam || !member) return;

      const userId = member.userId || String(member.id);
      if (!userId || userId === "undefined" || userId === "NaN") {
        setDisplayRole("Thành viên");
        return;
      }

      const role = await memberService.getTeamMemberRole(activeTeam, userId);
      setDisplayRole(role);
    };
    fetchRole();
  }, [activeTeam, member, memberId]);
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
                <div className="text-sm opacity-80">Mã: {member.userId}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm opacity-70">Chức vụ</div>
                <div
                  className={`text-center py-1 px-3 w-fit ${getRoleStyle(
                    displayRole
                  )} rounded-sm text-sm font-semibold`}
                >
                  {displayRole}
                </div>
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
                      className={`bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm cursor-pointer hover:bg-amber-200 transition-colors ${
                        activeTeam === t ? "ring-2 ring-amber-300" : ""
                      }`}
                      onClick={async () => {
                        setActiveTeam(t);

                        const userId = member.userId || String(member.id);
                        if (
                          !userId ||
                          userId === "undefined" ||
                          userId === "NaN"
                        ) {
                          setDisplayRole("Thành viên");
                          return;
                        }

                        const role = await memberService.getTeamMemberRole(
                          t,
                          userId
                        );
                        setDisplayRole(role);
                      }}
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
