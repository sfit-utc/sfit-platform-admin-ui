import {
  ApiError,
  CommitteeDetail,
  MemberOfCommittee,
  Target,
  Task,
} from "@/types/committee";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

class CommitteeDetailService {
  async getCommitteeInfor(id: number): Promise<CommitteeDetail> {
    return {
      id: 1,
      committeeName: "Ban chuyên môn",
      description:
        "Phụ trách tổ chức các hoạt động học tập, nghiên cứu khoa học và đào tạo kỹ năng lập trình",
      headOfCommittee: "Nguyễn Tú Anh",
      viceHeadOfCommittee: ["Nguyễn Tú Anh", "Nguyễn Tú Anh"],
    };

    try {
      const response = await fetch(`${API_BASE_URL}/committee-infor?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy api");
      }

      return response.json();
    } catch (error) {
      console.error("get committee information error: ", error);
      throw error;
    }
  }

  async getTask(id: number): Promise<Task[]> {
    return [
      {
        label: "Sự kiện OLP",
        items: [
          {
            title: "Chuẩn bị tài liệu môn Cấu trúc dữ liệu và giải thuật kỳ 1",
            expired: "12/06/2025",
            percentComplete: 60,
          },
          {
            title: "Chuẩn bị tài liệu môn Cấu trúc dữ liệu và giải thuật kỳ 1",
            expired: "12/06/2025",
            percentComplete: 100,
          },
          {
            title: "Chuẩn bị tài liệu môn Cấu trúc dữ liệu và giải thuật kỳ 1",
            expired: "12/06/2025",
            percentComplete: 60,
          },
        ],
      },
    ];

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

      return response.json();
    } catch (error) {
      console.error("get committee tasks error: ", error);
      throw error;
    }
  }

  async getCommitteeTarget(id: number): Promise<Target[]> {
    return [
      {
        id: 1,
        title: "Hoàn thành abc xyz",
        expired: "01/06/2025",
        headDo: false,
        secretaryDo: false,
      },
      {
        id: 2,
        title: "Hoàn thành abc xyz",
        expired: "01/06/2025",
        headDo: true,
        secretaryDo: true,
      },
      {
        id: 3,
        title: "Hoàn thành abc xyz",
        expired: "01/06/2025",
        headDo: true,
        secretaryDo: true,
      },
      {
        id: 4,
        title: "Hoàn thành abc xyz",
        expired: "01/06/2025",
        headDo: true,
        secretaryDo: true,
      },
      {
        id: 5,
        title: "Hoàn thành abc xyz",
        expired: "01/06/2025",
        headDo: true,
        secretaryDo: true,
      },
      {
        id: 6,
        title: "Hoàn thành abc xyzzzzzzzzzzzzzzzzzzzzzz",
        expired: "01/06/2025",
        headDo: true,
        secretaryDo: true,
      },
    ];

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

      return response.json();
    } catch (error) {
      console.error("get committee target error: ", error);
      throw error;
    }
  }

  async getMemberOfCommittee(id: number): Promise<MemberOfCommittee[]> {
    return [
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
        name: "Lê Văn Canh Tan Ma Van Giang",
        role: "Trưởng ban",
        class: "CNTT-K66",
        teams: ["Ban Sự kiện", "Ban Truyền thông"],
        avatar: "/avatars/user3.jpg",
        lastActive: "1 giờ trước",
      },
      {
        id: 4,
        name: "Phạm Thị D",
        role: "Thành viên",
        class: "CNTT-K67",
        teams: ["Ban Truyền thông"],
        avatar: "/avatars/user4.jpg",
        lastActive: "30 phút trước",
      },
      {
        id: 5,
        name: "Hoàng Văn E",
        role: "Thành viên",
        class: "CNTT-K68",
        teams: ["Ban Học tập", "Ban Công nghệ"],
        avatar: "/avatars/user5.jpg",
        lastActive: "5 phút trước",
      },
      {
        id: 6,
        name: "Vũ Thị F",
        role: "Thành viên",
        class: "CNTT-K66",
        teams: ["Ban Công nghệ", "Ban Sự kiện", "Ban Truyền thông"],
        avatar: "/avatars/user6.jpg",
        lastActive: "15 phút trước",
      },
      {
        id: 7,
        name: "Đặng Văn G",
        role: "Phó ban",
        class: "CNTT-K65",
        teams: ["Ban Sự kiện"],
        avatar: "/avatars/user7.jpg",
        lastActive: "45 phút trước",
      },
      {
        id: 8,
        name: "Bùi Thị H",
        role: "Thành viên",
        class: "CNTT-K67",
        teams: ["Ban Truyền thông", "Ban Học tập"],
        avatar: "/avatars/user8.jpg",
        lastActive: "1 giờ trước",
      },
      {
        id: 9,
        name: "Ngô Văn I",
        role: "Thành viên",
        class: "CNTT-K66",
        teams: ["Ban Học tập"],
        avatar: "/avatars/user9.jpg",
        lastActive: "20 phút trước",
      },
      {
        id: 10,
        name: "Lý Thị K",
        role: "Thành viên",
        class: "CNTT-K68",
        teams: ["Ban Công nghệ", "Ban Học tập"],
        avatar: "/avatars/user10.jpg",
        lastActive: "3 phút trước",
      },
      {
        id: 11,
        name: "Hồ Văn L",
        role: "Thành viên",
        class: "CNTT-K67",
        teams: ["Ban Sự kiện"],
        avatar: "/avatars/user11.jpg",
        lastActive: "12 phút trước",
      },
      {
        id: 12,
        name: "Đỗ Thị M",
        role: "Thành viên",
        class: "CNTT-K66",
        teams: ["Ban Truyền thông", "Ban Công nghệ"],
        avatar: "/avatars/user12.jpg",
        lastActive: "8 phút trước",
      },
      {
        id: 13,
        name: "Tô Văn N",
        role: "Phó ban",
        class: "CNTT-K65",
        teams: ["Ban Học tập", "Ban Sự kiện"],
        avatar: "/avatars/user13.jpg",
        lastActive: "25 phút trước",
      },
      {
        id: 14,
        name: "Dương Thị O",
        role: "Thành viên",
        class: "CNTT-K67",
        teams: ["Ban Công nghệ"],
        avatar: "/avatars/user14.jpg",
        lastActive: "40 phút trước",
      },
      {
        id: 15,
        name: "Mai Văn P",
        role: "Thành viên",
        class: "CNTT-K68",
        teams: ["Ban Sự kiện", "Ban Truyền thông", "Ban Học tập"],
        avatar: "/avatars/user15.jpg",
        lastActive: "7 phút trước",
      },
    ];

    try {
      const response = await fetch(
        `${API_BASE_URL}/committee-members?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy api committee members");
      }

      return response.json();
    } catch (error) {
      console.error("get error: ", error);
      throw error;
    }
  }

  async getPeriod(id: number): Promise<string> {
    return "30/01/2025 - 01/06/2025";
  }

  async deleteTarget(items: number[]): Promise<unknown> {
    return console.log(items);
  }
}

export const committeeDetailService = new CommitteeDetailService();
