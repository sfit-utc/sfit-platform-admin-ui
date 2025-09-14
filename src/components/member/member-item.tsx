"use client";
import { MemberListItem } from "@/types/member";
import { useState, useRef, useEffect } from "react";
import { memberService } from "@/services/member-service";
import Avatar from "@/assets/icons/user.svg";
import { SquarePen, Trash, User } from "lucide-react";
import DetailModal from "@/components/ui/detail-modal";
import EditModal from "@/components/ui/edit-modal";
import DeleteModal from "@/components/ui/delete-modal";

interface MemberItemProps {
  member: MemberListItem;
  style?: string;
  onMemberUpdated?: () => void;
}

export default function MemberItem({
  member,
  style,
  onMemberUpdated,
}: MemberItemProps) {
  // Early return if member is undefined
  if (!member) {
    return null;
  }

  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "Trưởng ban":
        return "text-purple-600 font-bold bg-purple-100";
      case "Phó ban":
        return "text-pink-500 font-semibold bg-pink-100";
      case "Thành viên":
        return "text-green-700 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowTeamsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [activeTeam, setActiveTeam] = useState<string>(
    member?.teams?.[0] || ""
  );
  const [displayRole, setDisplayRole] = useState<string>(member.role);
  const [teamRoles, setTeamRoles] = useState<Record<string, string>>({});
  const firstTeam = activeTeam;
  const hasMultipleTeams = member?.teams && member.teams.length > 1;

  useEffect(() => {
    setActiveTeam(member?.teams?.[0] || "");
    setDisplayRole(member.role);
  }, [member]);

  useEffect(() => {
    const fetchRole = async () => {
      if (!activeTeam) return;
      const role = await memberService.getTeamMemberRole(
        activeTeam,
        member.userId || String(member.id)
      );
      setDisplayRole(role);
    };
    fetchRole();
  }, [activeTeam, member.id, member.userId]);

  // Load all team roles for box view
  useEffect(() => {
    const loadAllTeamRoles = async () => {
      if (!member?.teams) return;

      const roles: Record<string, string> = {};
      for (const team of member.teams) {
        try {
          const role = await memberService.getTeamMemberRole(
            team,
            member.userId || String(member.id)
          );
          roles[team] = role;
        } catch (error) {
          roles[team] = "Thành viên";
        }
      }
      setTeamRoles(roles);
    };

    loadAllTeamRoles();
  }, [member?.teams, member.userId, member.id]);

  const lineView = (
    <div
      className="flex justify-between items-center py-4 border-2 my-2"
      style={{
        color: "var(--foreground)",
        backgroundColor: "var(--background)",
      }}
    >
      <div className="flex-2 text-center font-bold text-2xl">{member.id}</div>
      <div className="flex-5 text-left">
        <div className="font-bold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
          {member.name || "Unknown"}
        </div>
        <div className="text-sm text-gray-500">{member.email || "unknown"}</div>
      </div>
      <div className="flex-3 text-left relative" ref={dropdownRef}>
        <button
          type="button"
          className="w-full  flex items-center justify-between px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold whitespace-nowrap"
          onClick={() =>
            hasMultipleTeams && setShowTeamsDropdown(!showTeamsDropdown)
          }
          disabled={!hasMultipleTeams}
        >
          <span>{firstTeam}</span>
          {hasMultipleTeams && (
            <svg
              className="w-4 h-4 ml-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </button>

        {showTeamsDropdown && hasMultipleTeams && (
          <div
            className="absolute top-full left-0 mt-1 border border-gray-200 rounded-md shadow-lg z-10 min-w-full"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            <div className="p-1">
              {member?.teams?.map((team) => (
                <div
                  key={team}
                  className="py-1 px-3 hover:bg-amber-50 rounded text-sm cursor-pointer"
                  onClick={async () => {
                    setActiveTeam(team);
                    setShowTeamsDropdown(false);
                    const role = await memberService.getTeamMemberRole(
                      team,
                      member.userId || String(member.id)
                    );
                    setDisplayRole(role);
                  }}
                >
                  {team}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex-3 flex justify-center items-center">
        <div
          className={`text-center py-1 px-4 w-fit ${getRoleStyle(
            displayRole
          )} rounded-full text-sm font-semibold whitespace-nowrap`}
        >
          {displayRole}
        </div>
      </div>
      <div className="flex-2 flex justify-center items-center">
        <div className="text-center py-1 px-4 w-fit bg-blue-100 text-blue-600 rounded-full text-sm font-semibold whitespace-nowrap">
          {member.class}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center gap-1">
        <button
          className="p-1 rounded-full hover:text-green-400 hover:bg-gray-100"
          onClick={() => setOpenView(true)}
        >
          <User />
        </button>
        <button
          className="p-1 rounded-full hover:text-yellow-400 hover:bg-gray-100"
          onClick={() => setOpenEdit(true)}
        >
          <SquarePen />
        </button>
        <button
          className="p-1 rounded-full hover:text-red-400 hover:bg-gray-100"
          onClick={() => setOpenDelete(true)}
        >
          <Trash />
        </button>
      </div>
    </div>
  );

  const boxView = (
    <div
      className="rounded-lg shadow-md p-4 border flex flex-col justify-between"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="">
        <div className="flex items-center justify-between mb-3">
          <div
            className="text-lg font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {member.id}
          </div>
        </div>

        <div className="mb-3 flex flex-col justify-center items-center">
          <img
            src={Avatar.src || member.avatar}
            alt={member.name}
            className="w-24 h-24 rounded-full"
          />
          <h3 className="text-lg font-semibold mt-2 text-center">
            {member.name || "Unknown"}
          </h3>
          <span className="text-sm text-gray-500 mt-1">
            {member.email || "unknown"}
          </span>

          {/* Display Selected Team's Role */}
          <div className="mt-2"></div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Chức vụ:</span>
            <span
              className={`text-center py-1 px-4 w-fit ${getRoleStyle(
                displayRole
              )} rounded-sm text-sm font-semibold`}
            >
              {displayRole}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Lớp:</span>
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
              {member.class}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Ban:</span>
            <div className="flex flex-wrap gap-1">
              {member?.teams?.map((team, index) => (
                <span
                  key={index}
                  className={`bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm cursor-pointer hover:bg-amber-200 transition-colors ${
                    activeTeam === team ? "ring-2 ring-amber-300" : ""
                  }`}
                  onClick={async () => {
                    setActiveTeam(team);
                    const role = await memberService.getTeamMemberRole(
                      team,
                      member.userId || String(member.id)
                    );
                    setDisplayRole(role);
                  }}
                >
                  {team}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        <button
          className="p-2 rounded-full hover:bg-gray-100 hover:text-green-400"
          onClick={() => setOpenView(true)}
        >
          <User />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 hover:text-yellow-400"
          onClick={() => setOpenEdit(true)}
        >
          <SquarePen />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 hover:text-red-400"
          onClick={() => setOpenDelete(true)}
        >
          <Trash />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {style === "line" ? lineView : boxView}
      <DetailModal
        open={openView}
        onClose={() => setOpenView(false)}
        memberId={String(member.userId || member.id)}
      />
      <EditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        memberId={member.userId || member.id}
        onSaved={() => {
          // Refresh team roles when member is updated
          const loadAllTeamRoles = async () => {
            if (!member?.teams) return;

            const roles: Record<string, string> = {};
            for (const team of member.teams) {
              try {
                const role = await memberService.getTeamMemberRole(
                  team,
                  member.userId || String(member.id)
                );
                roles[team] = role;
              } catch (error) {
                roles[team] = "Thành viên";
              }
            }
            setTeamRoles(roles);
          };

          loadAllTeamRoles();

          if (onMemberUpdated) {
            onMemberUpdated();
          }
        }}
      />
      <DeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        memberId={member.userId || member.id}
        onDeleted={() => {
          if (onMemberUpdated) {
            onMemberUpdated();
          }
        }}
      />
    </>
  );
}
