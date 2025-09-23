import {
  ApiError,
  CommitteeDetail,
  MemberOfCommittee,
  Target,
  Task,
} from "@/types/committee";
import { teamService } from "./team-service";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/";

class CommitteeDetailService {
  async getCommitteeInfor(id: string): Promise<CommitteeDetail> {
    try {
      const teams = await teamService.getAllTeams();
      const team = teams.find(t => t.id === id);
      
      if (!team) {
        throw new Error(`Team with id ${id} not found`);
      }

      const membersResponse = await teamService.getTeamMembers(team.id, { page: 1, pageSize: 100 });
      const members = membersResponse.users || [];
      
      // Detect roles using backend values: HEADER / VICE / MEMBER (case-insensitive)
      const normalized = members.map(m => ({
        ...m,
        __role: (m.role || '').toString().trim().toUpperCase(),
      }));

      const headMember = normalized.find(member => member.__role === 'HEADER');
      const headName = headMember ? headMember.username : "Chưa xác định";

      const viceHeadNames = normalized
        .filter(member => member.__role === 'VICE')
        .map(member => member.username);

      return {
        id: team.id,
        committeeName: team.name,
        description: team.description,
        headOfCommittee: headName,
        viceHeadOfCommittee: viceHeadNames,
      };
    } catch (error) {
      console.error("get committee information error: ", error);
      throw error;
    }
  }

  async getTask(id: string): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/committee-tasks?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy api");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("get committee tasks error: ", error);
      return [];
    }
  }

  async getCommitteeTarget(id: string): Promise<Target[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/committee-target?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy api");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("get committee target error: ", error);
      return [];
    }
  }

  async getMemberOfCommittee(id: string): Promise<MemberOfCommittee[]> {
    try {
      const membersResponse = await teamService.getTeamMembers(id, { page: 1, pageSize: 100 });
      const members = membersResponse.users || [];
      
      const committeeMembers: MemberOfCommittee[] = members.map((member, index) => {
        const roleUpper = (member.role || '').toString().trim().toUpperCase();
        const roleName = roleUpper === 'HEADER' ? 'Trưởng ban'
          : roleUpper === 'VICE' ? 'Phó ban'
          : 'Thành viên';

        return {
          id: index + 1,
          name: member.username,
          role: roleName,
          class: "CNTT-K65",
          teams: [id.toString()],
          avatar: "/avatars/default.jpg",
          lastActive: "Vừa xong",
        };
      });
      return committeeMembers;
    } catch (error) {
      console.error("get committee members error: ", error);
      throw error;
    }
  }

  async getPeriod(id: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/committee-period?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy api");
      }

      const data = await response.json();
      return data.period || "30/01/2025 - 01/06/2025";
    } catch (error) {
      console.error("get committee period error: ", error);
      return "30/01/2025 - 01/06/2025";
    }
  }

  async createTarget(committeeId: string, targetData: {
    title: string;
    expired: string;
    headDo: boolean;
    secretaryDo: boolean;
  }): Promise<Target> {
    try {
      const response = await fetch(`${API_BASE_URL}/committee-target`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          committeeId,
          ...targetData,
        }),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể tạo mục tiêu");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("create target error: ", error);
      throw error;
    }
  }

  async deleteTarget(items: number[]): Promise<unknown> {
    try {
      const response = await fetch(`${API_BASE_URL}/committee-target/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetIds: items }),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể xóa mục tiêu");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("delete targets error: ", error);
      throw error;
    }
  }
}

export const committeeDetailService = new CommitteeDetailService();
