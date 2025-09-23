"use client";

import { useEffect, useRef, useState } from "react";
import { teamService } from "@/services/team-service";
import { Team } from "@/types/team";
import Modal from "@/components/ui/modal";
import { MoreHorizontal } from "lucide-react";

interface TeamListProps {
  onTeamSelect?: (team: Team) => void;
  showDescriptions?: boolean;
}

export default function TeamList({
  onTeamSelect,
  showDescriptions = false,
}: TeamListProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuTeamId, setOpenMenuTeamId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const fetchedTeams = await teamService.getAllTeams();
        setTeams(fetchedTeams);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch teams");
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        openMenuTeamId &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpenMenuTeamId(null);
      }
    };
    if (openMenuTeamId) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuTeamId]);

  async function handleDeleteTeam(teamId: string) {
    try {
      await teamService.deleteTeam(teamId);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
    } catch (err: any) {
      console.error("Delete team error:", err);
      setError(err.message || "Failed to delete team");
    } finally {
      setConfirmOpen(false);
      setOpenMenuTeamId(null);
      setTeamToDelete(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading teams...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p className="text-red-500 text-lg font-medium">Error loading teams</p>
        <p className="text-gray-500 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">No teams found</p>
        <p className="text-gray-400 text-sm mt-2">
          No teams are currently available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Available Teams
        </h2>
        <p className="text-gray-500 mt-2">
          {teams.length} team{teams.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`p-4 rounded-lg border transition-all duration-200 relative ${
              onTeamSelect
                ? "cursor-pointer hover:shadow-md hover:scale-105"
                : ""
            }`}
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--sfit-gray-200)",
            }}
            onClick={() => onTeamSelect?.(team)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ color: "var(--sfit-green)" }}
                >
                  {team.name}
                </h3>
                {showDescriptions && (
                  <p
                    className="text-sm mb-3"
                    style={{ color: "var(--foreground)" }}
                  >
                    {team.description}
                  </p>
                )}
                <div className="flex items-center text-xs text-gray-500">
                  <span>
                    Created: {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="ml-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuTeamId((prev) =>
                      prev === team.id ? null : team.id
                    );
                  }}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            {openMenuTeamId === team.id && (
              <div
                ref={menuRef}
                className="absolute right-2 top-10 bg-white border rounded shadow z-20"
                style={{ borderColor: "var(--sfit-gray-200)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                  onClick={() => {
                    setTeamToDelete(team);
                    setConfirmOpen(true);
                  }}
                >
                  Xóa nhóm
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        state={confirmOpen}
        funcClickToBack={() => {
          setConfirmOpen(false);
          setOpenMenuTeamId(null);
          setTeamToDelete(null);
        }}
        className="w-full max-w-md"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
          <p>
            Bạn có chắc chắn muốn xóa nhóm <b>{teamToDelete?.name}</b> không?
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              style={{ borderColor: "var(--sfit-gray-200)" }}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => teamToDelete && handleDeleteTeam(teamToDelete.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Xóa
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
