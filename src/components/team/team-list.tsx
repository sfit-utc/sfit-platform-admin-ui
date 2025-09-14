"use client";

import { useState, useEffect } from "react";
import { teamService } from "@/services/team-service";
import { Team } from "@/types/team";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
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
                    Created: {new Date(team.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {onTeamSelect && (
                <div className="ml-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "var(--sfit-green)" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
