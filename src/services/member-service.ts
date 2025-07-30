import { Member, MemberStats, MemberListItem, MemberFilters, ApiError } from "@/types/member";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

class MemberService {
  async getMemberStats(): Promise<MemberStats> {
    return {
      totalMembers: 85,
      activeMembers: 65,
      leaders: 25,
      newMembers: 5,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/member/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy thống kê thành viên");
      }

      return response.json();
    } catch (error) {
      console.error("get member stats error: ", error);
      throw error;
    }
  }

  async getMembers(filters?: MemberFilters): Promise<MemberListItem[]> {
    const mockMembers: MemberListItem[] = [
      {
        id: 1,
        name: "Nguyễn Văn A",
        role: "Phó CN",
        class: "CNTT-K65",
        teams: ["Web", "IOT"],
        avatar: "/avatars/user1.jpg",
        lastActive: "2 phút trước",
      },
      {
        id: 2,
        name: "Trần Thị B",
        role: "Chủ nhiệm",
        class: "CNTT-K64",
        teams: ["Chuyên môn"],
        avatar: "/avatars/user2.jpg",
        lastActive: "10 phút trước",
      },
      {
        id: 3,
        name: "Lê Văn C",
        role: "Trưởng ban",
        class: "CNTT-K66",
        teams: ["Sự kiện", "Truyền thông"],
        avatar: "/avatars/user3.jpg",
        lastActive: "1 giờ trước",
      },
      {
        id: 4,
        name: "Phạm Thị D",
        role: "Thành viên",
        class: "CNTT-K67",
        teams: ["Truyền thông"],
        avatar: "/avatars/user4.jpg",
        lastActive: "30 phút trước",
      },
      {
        id: 5,
        name: "Hoàng Văn E",
        role: "Thành viên",
        class: "CNTT-K68",
        teams: ["Học tập", "Công nghệ"],
        avatar: "/avatars/user5.jpg",
        lastActive: "5 phút trước",
      },
      {
        id: 6,
        name: "Vũ Thị F",
        role: "Thành viên",
        class: "CNTT-K66",
        teams: ["Công nghệ", "Sự kiện", "Truyền thông"],
        avatar: "/avatars/user6.jpg",
        lastActive: "15 phút trước",
      },
      {
        id: 7,
        name: "Đặng Văn G",
        role: "Phó ban",
        class: "CNTT-K65",
        teams: ["Sự kiện"],
        avatar: "/avatars/user7.jpg",
        lastActive: "45 phút trước",
      },
      {
        id: 8,
        name: "Bùi Thị H",
        role: "Thành viên",
        class: "CNTT-K67",
        teams: ["Truyền thông", "Học tập"],
        avatar: "/avatars/user8.jpg",
        lastActive: "1 giờ trước",
      },
      {
        id: 9,
        name: "Ngô Văn I",
        role: "Thành viên",
        class: "CNTT-K66",
        teams: ["Học tập"],
        avatar: "/avatars/user9.jpg",
        lastActive: "20 phút trước",
      },
      {
        id: 10,
        name: "Lý Thị K",
        role: "Thành viên",
        class: "CNTT-K68",
        teams: ["Công nghệ", "Học tập"],
        avatar: "/avatars/user10.jpg",
        lastActive: "3 phút trước",
      },
    ];

    let filteredMembers = mockMembers;
    if (filters) {
      if (filters.role) {
        filteredMembers = filteredMembers.filter(member => 
          member.role.toLowerCase().includes(filters.role!.toLowerCase())
        );
      }
      if (filters.class) {
        filteredMembers = filteredMembers.filter(member => 
          member.class.toLowerCase().includes(filters.class!.toLowerCase())
        );
      }
      if (filters.team) {
        filteredMembers = filteredMembers.filter(member => 
          member.teams.some(team => 
            team.toLowerCase().includes(filters.team!.toLowerCase())
          )
        );
      }
      if (filters.search) {
        const normalizedSearch = normalizeText(filters.search);
        filteredMembers = filteredMembers.filter(member => {
          const normalizedName = normalizeText(member.name);
          const normalizedRole = normalizeText(member.role);
          const normalizedTeams = member.teams.map(team => normalizeText(team));
          const normalizedClass = normalizeText(member.class);
          
          return (
            normalizedName.includes(normalizedSearch) ||
            normalizedRole.includes(normalizedSearch) ||
            normalizedTeams.some(team => team.includes(normalizedSearch)) ||
            normalizedClass.includes(normalizedSearch)
          );
        });
      }
    }

    return filteredMembers;

    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters as Record<string, string>).forEach(([key, value]) => {
          if (value) queryParams.append(key, value.toString());
        });
      }

      const response = await fetch(`${API_BASE_URL}/members?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy danh sách thành viên");
      }

      return response.json();
    } catch (error) {
      console.error("get members error: ", error);
      throw error;
    }
  }

  async getMemberById(id: number): Promise<Member> {
    const mockMember: Member = {
      id: id,
      name: "Nguyễn Văn A",
      teams: ["Frontend", "UI/UX"],
      role: "Thành viên",
      class: "CNTT-K65",
      email: "nguyenvana@example.com",
      avatar: "/avatars/user1.jpg",
      status: "active",
      joinDate: "01/09/2023",
    };

    return mockMember;

    try {
      const response = await fetch(`${API_BASE_URL}/members/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy thông tin thành viên");
      }

      return response.json();
    } catch (error) {
      console.error("get member by id error: ", error);
      throw error;
    }
  }

  async createMember(data: Omit<Member, 'id'>): Promise<Member> {
    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể tạo thành viên mới");
      }

      return response.json();
    } catch (error) {
      console.error("create member error: ", error);
      throw error;
    }
  }

  async updateMember(id: number, data: Partial<Member>): Promise<Member> {
    try {
      const response = await fetch(`${API_BASE_URL}/members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể cập nhật thành viên");
      }

      return response.json();
    } catch (error) {
      console.error("update member error: ", error);
      throw error;
    }
  }

  async deleteMember(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/members/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể xóa thành viên");
      }
    } catch (error) {
      console.error("delete member error: ", error);
      throw error;
    }
  }
}

export const memberService = new MemberService();

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}