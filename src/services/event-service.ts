import { Event, ApiError } from '@/types/event';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Flag to switch between mock data and real API
const USE_MOCK_DATA = true; // Set to false when you want to use real API

// Mock data inline
const mockEvents: Event[] = [
  {
    id: 1,
    title: "Hội thảo Công nghệ AI 2024",
    date: "2024-12-15",
    address: "Trung tâm Hội nghị Quốc gia, Hà Nội",
    participants: 150,
    status: "upcoming",
    requirements: "Đăng ký trước 10/12/2024, Phí tham dự: 500,000 VNĐ"
  },
  {
    id: 2,
    title: "Workshop Phát triển Web với React",
    date: "2024-12-20",
    address: "Tòa nhà FPT, Quận 1, TP.HCM",
    participants: 80,
    status: "upcoming",
    requirements: "Mang laptop cá nhân, Kiến thức cơ bản về JavaScript"
  },
  {
    id: 3,
    title: "Cuộc thi Hackathon SFIT 2024",
    date: "2024-12-10",
    address: "Trường Đại học FPT, Đà Nẵng",
    participants: 200,
    status: "ongoing",
    requirements: "Đội 3-5 người, Thời gian: 48 giờ liên tục"
  },
  {
    id: 4,
    title: "Seminar Kỹ năng Lãnh đạo",
    date: "2024-11-25",
    address: "Khách sạn Sheraton, Hà Nội",
    participants: 120,
    status: "past",
    requirements: "Dress code: Business casual, Đăng ký qua email"
  },
  {
    id: 5,
    title: "Lễ Tốt nghiệp Khóa 2024",
    date: "2024-12-30",
    address: "Nhà thi đấu Đại học FPT, TP.HCM",
    participants: 500,
    status: "upcoming",
    requirements: "Sinh viên tốt nghiệp và gia đình, Dress code: Áo dài/Complê"
  },
  {
    id: 6,
    title: "Hội thảo Khởi nghiệp",
    date: "2024-11-20",
    address: "Trung tâm Khởi nghiệp, Đà Nẵng",
    participants: 75,
    status: "past",
    requirements: "Có ý tưởng khởi nghiệp, Pitch deck 5 phút"
  },
  {
    id: 7,
    title: "Cuộc thi Lập trình ACM-ICPC",
    date: "2024-12-05",
    address: "Phòng máy tính, Đại học FPT",
    participants: 60,
    status: "ongoing",
    requirements: "Đội 3 người, Kiến thức thuật toán, Thời gian: 5 giờ"
  },
  {
    id: 8,
    title: "Workshop Machine Learning",
    date: "2024-12-25",
    address: "Phòng Lab AI, Tòa nhà Innovation, TP.HCM",
    participants: 40,
    status: "upcoming",
    requirements: "Kiến thức Python cơ bản, Mang laptop có GPU (nếu có)"
  }
];

class EventService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
  }

  // Simulate API delay for realistic testing
  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getEvents(): Promise<Event[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return [...mockEvents]; // Return a copy to avoid mutations
    }

    const response = await fetch(`${API_BASE_URL}/events`);
    return this.handleResponse<Event[]>(response);
  }

  async getEventById(id: number): Promise<Event> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const event = mockEvents.find(e => e.id === id);
      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    }

    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return this.handleResponse<Event>(response);
  }

  async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const newEvent: Event = {
        ...event,
        id: Math.max(...mockEvents.map(e => e.id || 0)) + 1,
      };
      mockEvents.push(newEvent);
      return newEvent;
    }

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    return this.handleResponse<Event>(response);
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const eventIndex = mockEvents.findIndex(e => e.id === id);
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...eventData };
      return mockEvents[eventIndex];
    }

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return this.handleResponse<Event>(response);
  }

  async deleteEvent(id: number): Promise<void> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const eventIndex = mockEvents.findIndex(e => e.id === id);
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      mockEvents.splice(eventIndex, 1);
      return;
    }

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to delete event');
    }
  }

  async registerForEvent(eventId: number, userId: number): Promise<void> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const event = mockEvents.find(e => e.id === eventId);
      if (!event) {
        throw new Error('Event not found');
      }
      // In a real implementation, you would update the participants count
      // For now, we'll just simulate success
      return;
    }

    const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to register for event');
    }
  }

  // Additional methods for filtering and searching
  async getEventsByStatus(status: 'ongoing' | 'upcoming' | 'past'): Promise<Event[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      return mockEvents.filter(event => event.status === status);
    }

    const response = await fetch(`${API_BASE_URL}/events?status=${status}`);
    return this.handleResponse<Event[]>(response);
  }

  async searchEvents(searchTerm: string): Promise<Event[]> {
    if (USE_MOCK_DATA) {
      await this.simulateDelay();
      const term = searchTerm.toLowerCase();
      return mockEvents.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.address.toLowerCase().includes(term) ||
        event.requirements?.toLowerCase().includes(term)
      );
    }

    const response = await fetch(`${API_BASE_URL}/events/search?q=${encodeURIComponent(searchTerm)}`);
    return this.handleResponse<Event[]>(response);
  }
}

export const eventService = new EventService();
