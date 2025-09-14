import { ApiError, Class, Event, Task } from "@/types/home";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

class HomeService {
  async getNearTasks(): Promise<Task[]> {
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("get tasks error: ", error);
      // Return empty array if API fails
      return [];
    }
  }

  async getUpcomingEvents(): Promise<Event[]> {
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("get upcoming event error: ", error);
      // Return empty array if API fails
      return [];
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("get classes error: ", error);
      // Return empty array if API fails
      return [];
    }
  }

  async getEventStarted(): Promise<Event[]> {
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("get started event error: ", error);
      // Return empty array if API fails
      return [];
    }
  }
}

export const homeService = new HomeService();
