"use client";

import CommitteeItem from "@/components/committee/committee-item";
import DashboardAction from "@/components/ui/dashboard-action";
import { useAllCommitteeInfor } from "@/hooks/use-committee-service";
import { CalendarDays, ClipboardList, Plus, Star, Video } from "lucide-react";
import Loading from "@/components/ui/loading";
import { useState } from "react";
import CreateTeamModal from "../team/create-team-modal";
import Modal from "@/components/ui/modal";
import { teamService } from "@/services/team-service";

const dashboardActions = [
  {
    icon: <ClipboardList />,
    children: "Giao nhiệm vụ các ban",
    textColor: "text-sfit-purple",
    bgColor: "bg-sfit-purple-light ",
    href: "/add-task",
  },
  {
    icon: <CalendarDays />,
    children: "Lịch hoạt động",
    textColor: "text-sfit-green",
    bgColor: "bg-sfit-green-light ",
    href: "/action-calendar",
  },
  {
    icon: <Star />,
    children: "Đánh giá hoạt động",
    textColor: "text-sfit-blue",
    bgColor: "bg-sfit-blue-light ",
    href: "/action-check",
  },
  {
    icon: <Video />,
    children: "Họp câu lạc bộ",
    textColor: "text-sfit-yellow",
    bgColor: "bg-sfit-yellow-light",
    href: "/meeting-club",
  },
];

export default function Committee() {
  const {
    data: committeeItems,
    loading: loadCommittees,
    refetch,
  } = useAllCommitteeInfor();
  const [openCreateTeam, setOpenCreateTeam] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [committeeToDelete, setCommitteeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCommittee = async () => {
    if (!committeeToDelete) return;

    setIsDeleting(true);
    try {
      await teamService.deleteTeam(committeeToDelete.id);
      // Refresh the committee list to show the deleted team is gone
      await refetch();
      setConfirmDelete(false);
      setCommitteeToDelete(null);
    } catch (error) {
      console.error("Error deleting committee:", error);
      // You could add a toast notification here for error handling
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-4 gap-5">
        {dashboardActions.map(
          ({ icon, children, textColor, bgColor, href }) => (
            <DashboardAction
              key={children}
              href={href}
              className={`${textColor} ${bgColor} px-2 py-4`}
              icon={icon}
            >
              {children}
            </DashboardAction>
          )
        )}
      </div>
      {loadCommittees ? (
        <Loading className="mx-auto my-10 w-fit" size={48} />
      ) : (
        <div className="mt-5 grid lg:grid-cols-3 gap-4">
          {committeeItems.map(
            ({
              id,
              committeeName,
              headOfCommittee,
              description,
              numberOfMember,
            }) => (
              <CommitteeItem
                key={id}
                id={id}
                committeeName={committeeName}
                headOfCommittee={headOfCommittee}
                description={description}
                numberOfMember={numberOfMember}
                onDelete={(committeeId) => {
                  setCommitteeToDelete({
                    id: committeeId,
                    name: committeeName,
                  });
                  setConfirmDelete(true);
                }}
              />
            )
          )}
        </div>
      )}
      <div
        className="fixed right-5 bottom-5 h-14 w-14 rounded-full bg-sfit-blue flex justify-center items-center cursor-pointer"
        onClick={() => setOpenCreateTeam(true)}
      >
        <Plus className="text-white size-10" />
      </div>
      <CreateTeamModal
        open={openCreateTeam}
        onClose={() => setOpenCreateTeam(false)}
        onCreated={refetch}
      />

      <Modal
        state={confirmDelete}
        funcClickToBack={() => {
          setConfirmDelete(false);
          setCommitteeToDelete(null);
        }}
        className="w-full max-w-md"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
          <p>
            Bạn có chắc chắn muốn xóa nhóm <b>{committeeToDelete?.name}</b>{" "}
            không? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(false);
                setCommitteeToDelete(null);
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              style={{ borderColor: "var(--sfit-gray-200)" }}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleDeleteCommittee}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
