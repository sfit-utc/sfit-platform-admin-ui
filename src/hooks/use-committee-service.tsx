import { teamService } from "@/services/team-service";
import { CommitteeInfo } from "@/types/committee";
import { useEffect, useState } from "react";

interface UseCommitteeServiceType<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useAllCommitteeInfor(): UseCommitteeServiceType<
  CommitteeInfo[]
> {
  const [data, setData] = useState<CommitteeInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCommitteeInfo = async () => {
    try {
      const teams = await teamService.getAllTeams();
      const committeeInfoPromises = teams.map(async (team) => {
        try {
          const membersResponse = await teamService.getTeamMembers(team.id, {
            page: 1,
            pageSize: 100,
          });
          const memberCount = membersResponse.users?.length || 0;
          // Find the head of the team from members (supports BACKEND roles: HEADER/VICE/MEMBER)
          const headMember = membersResponse.users?.find((user) => {
            const role = (user.role || "").toString().trim().toUpperCase();
            return role === "HEADER"; // head of committee
          });
          const headOfCommittee = headMember
            ? headMember.username
            : "Chưa xác định";

          return {
            id: team.id,
            committeeName: team.name,
            headOfCommittee: headOfCommittee,
            description: team.description,
            numberOfMember: memberCount,
          };
        } catch (error) {
          console.error(
            `Error fetching member count for team ${team.id}:`,
            error
          );
          return {
            id: team.id,
            committeeName: team.name,
            headOfCommittee: "Chưa xác định",
            description: team.description,
            numberOfMember: 0,
          };
        }
      });

      const committeeInfo = await Promise.all(committeeInfoPromises);
      setData(committeeInfo);
    } catch (error) {
      console.error("Error fetching committee information:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitteeInfo();
  }, []);

  return { data, loading, error, refetch: fetchCommitteeInfo };
}
