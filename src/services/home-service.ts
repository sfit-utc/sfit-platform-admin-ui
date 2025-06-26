import { ApiError, Class, Event, Task } from "@/types/home";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

class HomeService {
  async getNearTasks(): Promise<Task[]> {
    return [
      {
        title: "Chuẩn bị tài liệu workshop React",
        expired: "12/6/2025",
        percentComplete: 20,
      },
      {
        title: "Tạo slide giới thiệu React",
        expired: "10/6/2025",
        percentComplete: 70,
      },
      {
        title: "Chuẩn bị bài tập thực hành",
        expired: "11/6/2025",
        percentComplete: 100,
      },
    ];
    try {
      const response = await fetch(`${API_BASE_URL}/near-tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy api task");
      }

      return response.json();
    } catch (error) {
      console.error("get tasks error: ", error);
      throw error;
    }
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return [
      {
        eventTitle: "Workshop: React & Next.js cơ bản",
        when: "8h ngày 20/06/2025",
        howManyPeople: 40,
      },
    ];
    try {
      const response = await fetch(`${API_BASE_URL}/upcoming-events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy api upcoming events");
      }

      return response.json();
    } catch (error) {
      console.error("get upcoming event error: ", error);
      throw error;
    }
  }

  async getWeekClasses(): Promise<string> {
    const today = new Date();

    const sunday = new Date(today);
    const day = 7 - sunday.getDay();
    sunday.setDate(sunday.getDate() + day);

    const formatDate = (date: Date): string => {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    return `${formatDate(today)} - ${formatDate(sunday)}`;
  }

  async getClasses(): Promise<Class[]> {
    return [
      {
        className: "Cấu trúc dữ liệu và giải thuật",
        when: "Thứ 2: 18:00 - 20:00",
        teacher: "Lê Văn Cường",
        status: "complete",
      },
      {
        className: "Thiết kế web",
        when: "Thứ 3: 18:00 - 20:00",
        teacher: "Lê Văn Cường",
        status: "in-progress",
      },
      {
        className: "Cấu trúc dữ liệu và giải thuật",
        when: "Thứ 2: 18:00 - 20:00",
        teacher: "Lê Văn Cường",
        status: "complete",
      },
      {
        className: "Thiết kế web",
        when: "Thứ 3: 18:00 - 20:00",
        teacher: "Lê Văn Cường",
        status: "in-progress",
      },
    ];
    try {
      const response = await fetch(`${API_BASE_URL}/class`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || "Không thể lấy api các lớp");
      }

      return response.json();
    } catch (error) {
      console.error("get classes error: ", error);
      throw error;
    }
  }

  async getEventStarted(): Promise<Event[]> {
    return [
      {
        eventTitle: "Cuộc thi lập trình OLP Tin học",
        when: "13h ngày 01/06/2025",
        howManyPeople: 100,
        status: "in-progress",
      },
      {
        eventTitle: "Cuộc thi lập trình ACM",
        when: "13h ngày 25/05/2025",
        howManyPeople: 20,
        status: "complete",
      },
      {
        eventTitle: "Cuộc thi lập trình OLP Tin học",
        when: "13h ngày 01/06/2025",
        howManyPeople: 100,
        status: "in-progress",
      },
      {
        eventTitle: "Cuộc thi lập trình ACM",
        when: "13h ngày 25/05/2025",
        howManyPeople: 20,
        status: "complete",
      },
    ];
    try {
      const response = await fetch(`${API_BASE_URL}/class`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(
          error.message || "Không thể lấy api các event đã bắt đầu"
        );
      }

      return response.json();
    } catch (error) {
      console.error("get started event error: ", error);
      throw error;
    }
  }
}

export const homeService = new HomeService();
