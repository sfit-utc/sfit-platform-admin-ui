import ClassItem from '@/components/home/class-item';
import { Class, ApiError } from '@/types/class';
import { resolve } from 'path';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const USE_MOCK_DATA = true;

const mockClasses: Class[] = [
  {
    id: 1,
    title: "Lập trình Web với React",
    description: "Khóa học cung cấp kiến thức cơ bản đến nâng cao về React, bao gồm hooks, state management, và best practices trong phát triển web hiện đại.",
    teacher: "Nguyễn Văn An",
    time: "15/5/2025 - 15/7/2025",
    schedule: "Thứ 2, Thứ 4 19:00-21:00",
    address: "Phòng 404-A4",
    status: "ongoing"
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    description: "Giới thiệu về machine learning, các thuật toán cơ bản, và ứng dụng thực tế trong việc xử lý dữ liệu và dự đoán.",
    teacher: "Trần Thị Bình",
    time: "20/6/2025 - 20/8/2025",
    schedule: "Thứ 3, Thứ 5 14:00-16:00",
    address: "Phòng 404-A4",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Tiếng Anh Giao tiếp Nâng cao",
    description: "Rèn luyện kỹ năng giao tiếp tiếng Anh trong môi trường công việc, thuyết trình và đàm phán quốc tế.",
    teacher: "Sarah Johnson",
    time: "10/5/2025 - 10/8/2025",
    schedule: "Thứ 2, Thứ 6 18:00-20:00",
    address: "Phòng 404-A4",
    status: "ongoing"
  },
  {
    id: 4,
    title: "Phát triển Ứng dụng Mobile",
    description: "Học cách xây dựng ứng dụng mobile cross-platform sử dụng React Native và Flutter.",
    teacher: "Lê Minh Cường",
    time: "25/7/2025 - 25/9/2025",
    schedule: "Thứ 4, Thứ 7 15:00-17:00",
    address: "Phòng 404-A4",
    status: "upcoming"
  },
  {
    id: 5,
    title: "Kỹ năng Lãnh đạo và Quản lý",
    description: "Phát triển kỹ năng lãnh đạo, quản lý nhóm và dự án trong môi trường công nghệ.",
    teacher: "Phạm Thị Dung",
    time: "1/3/2025 - 1/5/2025",
    schedule: "Thứ 7 09:00-11:00",
    address: "Phòng 404-A4",
    status: "past"
  },
  {
    id: 6,
    title: "Bảo mật Thông tin và Mạng",
    description: "Tìm hiểu về các kỹ thuật bảo mật, mã hóa và bảo vệ hệ thống thông tin.",
    teacher: "Hoàng Văn Em",
    time: "5/5/2025 - 5/7/2025",
    schedule: "Thứ 3, Thứ 5 13:00-15:00",
    address: "Phòng 404-A4",
    status: "ongoing"
  },
  {
    id: 7,
    title: "Thiết kế UI/UX",
    description: "Học cách thiết kế giao diện người dùng đẹp và trải nghiệm người dùng tối ưu.",
    teacher: "Nguyễn Thị Phương",
    time: "30/8/2025 - 30/10/2025",
    schedule: "Thứ 2, Thứ 4 16:00-18:00",
    address: "Phòng 404-A4",
    status: "upcoming"
  },
  {
    id: 8,
    title: "Phân tích Dữ liệu với Python",
    description: "Sử dụng Python để phân tích dữ liệu, tạo báo cáo và trực quan hóa thông tin.",
    teacher: "Vũ Hoàng Giang",
    time: "1/2/2025 - 1/4/2025",
    schedule: "Thứ 6 10:00-12:00",
    address: "Phòng 404-A4",
    status: "past"
  },
  {
    id: 9,
    title: "Kỹ năng Thuyết trình và Pitching",
    description: "Rèn luyện kỹ năng thuyết trình, pitching ý tưởng và giao tiếp hiệu quả.",
    teacher: "Đỗ Thị Hương",
    time: "15/9/2025 - 15/11/2025",
    schedule: "Thứ 5 19:00-21:00",
    address: "Phòng 404-A4",
    status: "upcoming"
  },
  {
    id: 10,
    title: "Blockchain và Tiền điện tử",
    description: "Tìm hiểu về công nghệ blockchain, smart contracts và ứng dụng trong thực tế.",
    teacher: "Trần Văn Khoa",
    time: "10/4/2025 - 10/6/2025",
    schedule: "Thứ 7 14:00-16:00",
    address: "Phòng 404-A4",
    status: "ongoing"
  }
];

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

class ClassService {
    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.message || 'Something went wrong in class')
        }
        return response.json()
    }

    private async simulateDelay(ms: number = 500): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getClasses(): Promise<Class[]> {
        if (USE_MOCK_DATA) {
            await this.simulateDelay();
            return [...mockClasses];
        }

        const response = await fetch(`${API_BASE_URL}/class`)
        return this.handleResponse<Class[]>(response);
    }

    async getClassByID(id: number): Promise<Class> {
        if (USE_MOCK_DATA) {
            await this.simulateDelay();
            const classItem = mockClasses.find(e => e.id === id);
            if (!classItem) {
                throw new Error("Class not found");
            }
            return classItem;
        }

        const response = await fetch(`${API_BASE_URL}/class/${id}`);
        return this.handleResponse<Class>(response);
    }

    async createClass(classItem: Omit<Class, 'id'>): Promise<Class> {
        if (USE_MOCK_DATA) {
            await this.simulateDelay();
            const newClass: Class = {
                ...classItem,
                id: Math.max(...mockClasses.map(e => e.id || 0)) + 1
            };
            mockClasses.push(newClass)
            return newClass
        }

        const response = await fetch(`${API_BASE_URL}/class`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(classItem),
        })
        return this.handleResponse<Class>(response);
    }

    async updateClass(id: number, classData: Partial<Class>): Promise<Class> {
        if(USE_MOCK_DATA) {
            await this.simulateDelay();
            const classIndex = mockClasses.findIndex(e => e.id === id);
            if (classIndex === -1) {
                throw new Error('Class not found');
            }

            mockClasses[classIndex] = {...mockClasses[classIndex], ...classData};
            return mockClasses[classIndex];
        }

        const response = await fetch(`${API_BASE_URL}/class/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(classData)
        })
        return this.handleResponse<Class>(response);
    }

    async deleteClass(id: number): Promise<void> {
        if (USE_MOCK_DATA) {
            await this.simulateDelay();
            const classIndex = mockClasses.findIndex(e => e.id === id);
            if (classIndex === -1) {
                throw new Error('Class not found');
            }
            mockClasses.splice(classIndex,1);
            return
        }

        const response = await fetch(`${API_BASE_URL}/class/${id}`, {
            method:'DELETE',
        })

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.message || 'Failed to delete class');
        }
    }

    async registerForClass(classId: number, userId: number): Promise<void> {
        if (USE_MOCK_DATA) {
            await this.simulateDelay();
            const classItem = mockClasses.find(e => e.id === classId)
            if (!classItem) {
                throw new Error('Class not found');
            }
            return;
        }

        const response = await fetch(`${API_BASE_URL}/class/${classId}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const error: ApiError = await response.json();
            throw new Error(error.message || 'Failed to register for class');
        }
    }

    async getClassesByStatus(status: 'ongoing' | 'upcoming' | 'past'): Promise<Class[]> {
        if (USE_MOCK_DATA) {
            await this.simulateDelay();
            return mockClasses.filter(classItem => classItem.status === status);
        }

        const response = await fetch(`${API_BASE_URL}/class?status=${status}`);
        return this.handleResponse<Class[]>(response);
    }

    async searchClasses(searchTerm: string): Promise<Class[]> {
        if (USE_MOCK_DATA) {
            await this.simulateDelay();
            const term = searchTerm.toLowerCase();
            return mockClasses.filter(classItem => 
                classItem.title.toLowerCase().includes(term) ||
                classItem.description.toLowerCase().includes(term) ||
                classItem.teacher.toLowerCase().includes(term) ||
                classItem.address.toLowerCase().includes(term)
            );
        }

        const response = await fetch(`${API_BASE_URL}/class/search?q=${encodeURIComponent(searchTerm)}`);
        return this.handleResponse<Class[]>(response);
    }
}

export const classService = new ClassService();
