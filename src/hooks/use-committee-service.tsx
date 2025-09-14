import { teamService } from "@/services/team-service";
import { memberService } from "@/services/member-service";
import { CommitteeInfo } from "@/types/committee";
import { useEffect, useState } from "react";

interface UseCommitteeServiceType<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export function useAllCommitteeInfor(): UseCommitteeServiceType<
  CommitteeInfo[]
> {
  const [data, setData] = useState<CommitteeInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCommitteeInfo = async () => {
      try {
        const teams = await teamService.getAllTeams();
        const teamIds = teams.map((team) => team.id);
        const teamHeads = await memberService.getTeamHeads(teamIds);
        const committeeInfoPromises = teams.map(async (team) => {
          try {
            const membersResponse = await teamService.getTeamMembers(team.id, {
              page: 1,
              pageSize: 100,
            });
            const memberCount = membersResponse.users?.length || 0;

            return {
              id: team.id,
              committeeName: team.name,
              headOfCommittee: teamHeads[team.id] || "Chưa xác định",
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
              headOfCommittee: teamHeads[team.id] || "Chưa xác định",
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

    fetchCommitteeInfo();
  }, []);

  return { data, loading, error };
}
