import { ApiError, CommitteeInfo } from "@/types/committee";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

class CommitteeService {
  async getAllCommitteeInformation(): Promise<CommitteeInfo[]> {
    return [
      {
        id: 1,
        committeeName: "BAN CHUYÊN MÔN",
        headOfCommittee: "Nguyễn Tú Anh",
        description:
          "Phụ trách tổ chức các hoạt động học tập, nghiên cứu khoa học và đào tạo kỹ năng lập trình",
        numberOfMember: 20,
        href: "/",
      },
      {
        id: 2,
        committeeName: "BAN WEB",
        headOfCommittee: "Nguyễn Tú Anh",
        description:
          "Phụ trách tổ chức các hoạt động học tập, nghiên cứu khoa học và đào tạo kỹ năng lập trình",
        numberOfMember: 20,
        href: "/",
      },
      {
        id: 3,
        committeeName: "BAN DATA & AI",
        headOfCommittee: "Nguyễn Tú Anh",
        description:
          "Phụ trách tổ chức các hoạt động học tập, nghiên cứu khoa học và đào tạo kỹ năng lập trình",
        numberOfMember: 20,
        href: "/",
      },
      {
        id: 4,
        committeeName: "BAN GAME",
        headOfCommittee: "Nguyễn Tú Anh",
        description:
          "Phụ trách tổ chức các hoạt động học tập, nghiên cứu khoa học và đào tạo kỹ năng lập trình",
        numberOfMember: 20,
        href: "/",
      },
      {
        id: 5,
        committeeName: "BAN KỸ THUẬT MÁY TÍNH",
        headOfCommittee: "Nguyễn Tú Anh",
        description:
          "Phụ trách tổ chức các hoạt động học tập, nghiên cứu khoa học và đào tạo kỹ năng lập trình",
        numberOfMember: 20,
        href: "/",
      },
      {
        id: 6,
        committeeName: "BAN IOT",
        headOfCommittee: "Nguyễn Tú Anh",
        description:
          "Phụ trách tổ chức các hoạt động học tập, nghiên cứu khoa học và đào tạo kỹ năng lập trình",
        numberOfMember: 20,
        href: "/",
      },
      {
        id: 7,
        committeeName: "BAN TRUYỀN THÔNG",
        headOfCommittee: "Nguyễn Tú Anh",
        description:
          "Phụ trách tổ chức các hoạt động học tập, nghiên cứu khoa học và đào tạo kỹ năng lập trình",
        numberOfMember: 20,
        href: "/",
      },
      {
        id: 8,
        committeeName: "BAN ĐỐI NGOẠI",
        headOfCommittee: "Nguyễn Tú Anh",
        description:
          "Phụ trách tổ chức các hoạt động học tập, nghiên cứu khoa học và đào tạo kỹ năng lập trình",
        numberOfMember: 20,
        href: "/",
      },
      {
        id: 9,
        committeeName: "BAN HẬU CẦN",
        headOfCommittee: "Nguyễn Tú Anh",
        description:
          "Phụ trách tổ chức các hoạt động học tập, nghiên cứu khoa học và đào tạo kỹ năng lập trình",
        numberOfMember: 20,
        href: "/",
      },
    ];

    try {
      const response = await fetch(`${API_BASE_URL}/all-committee-info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy api all committee");
      }

      return response.json();
    } catch (error) {
      console.error("get all committees error: ", error);
      throw error;
    }
  }
}

export const committeeService = new CommitteeService();
