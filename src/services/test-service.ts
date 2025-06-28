import { Test } from "@/types/class";

export const mockTests: Test[] = [
  {
    id: 1,
    title: "Midterm Exam - React",
    description: "Bài kiểm tra giữa kỳ cho môn Lập trình Web với React.",
    date: "19:00 10/6/2025",
    time: "2 giờ",
    status: "upcoming",
    isRanking: true,
    participants: 30
  },
  {
    id: 2,
    title: "Final Exam - Machine Learning",
    description: "Bài kiểm tra cuối kỳ cho môn Machine Learning.",
    date: "14:00 20/8/2025",
    time: "3 giờ",
    status: "upcoming",
    isRanking: true,
    participants: 25
  },
  {
    id: 3,
    title: "Quiz - English Communication",
    description: "Quiz kiểm tra kỹ năng giao tiếp tiếng Anh.",
    date: "18:00 15/7/2025",
    time: "1 hour",
    status: "ongoing",
    isRanking: false,
    participants: 40
  },
  {
    id: 4,
    title: "Mobile App Project Demo",
    description: "Demo dự án cuối kỳ môn Phát triển Ứng dụng Mobile.",
    date: "15:00 30/9/2025",
    time: "2 giờ",
    status: "upcoming",
    isRanking: false,
    participants: 20
  },
  {
    id: 5,
    title: "Security Lab Test",
    description: "Bài kiểm tra thực hành bảo mật thông tin.",
    date: "13:00 10/7/2025",
    time: "2.5 giờ",
    status: "past",
    isRanking: true,
    participants: 18
  },
  {
    id: 6,
    title: "UI/UX Design Challenge",
    description: "Thử thách thiết kế giao diện người dùng.",
    date: "09:00 25/8/2025",
    time: "4 giờ",
    status: "upcoming",
    isRanking: true,
    participants: 35
  },
  {
    id: 7,
    title: "Data Analysis Quiz",
    description: "Quiz phân tích dữ liệu với Python.",
    date: "10:00 5/8/2025",
    time: "90 minutes",
    status: "upcoming",
    isRanking: false,
    participants: 28
  },
  {
    id: 8,
    title: "Leadership Skills Assessment",
    description: "Đánh giá kỹ năng lãnh đạo và quản lý.",
    date: "16:00 12/9/2025",
    time: "1.5 giờ",
    status: "upcoming",
    isRanking: true,
    participants: 22
  },
  {
    id: 9,
    title: "Blockchain Coding Contest",
    description: "Cuộc thi lập trình blockchain và smart contracts.",
    date: "08:00 18/10/2025",
    time: "5 giờ",
    status: "upcoming",
    isRanking: true,
    participants: 15
  },
  {
    id: 10,
    title: "Presentation Skills Test",
    description: "Kiểm tra kỹ năng thuyết trình và pitching.",
    date: "20:00 8/11/2025",
    time: "45 minutes",
    status: "upcoming",
    isRanking: false,
    participants: 32
  }
];

export class TestService {
  async getTests(): Promise<Test[]> {
    // Simulate async fetch
    return new Promise((resolve) => setTimeout(() => resolve([...mockTests]), 300));
  }

  async getTestByID(id: number): Promise<Test | undefined> {
    return new Promise((resolve) => setTimeout(() => resolve(mockTests.find(t => t.id === id)), 200));
  }
} 