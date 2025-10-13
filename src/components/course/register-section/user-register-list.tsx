import { useCourseService } from "@/hooks/use-course-service";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DeleteIcon } from "lucide-react";
import { PenIcon } from "lucide-react";
interface UserRegisterListProps {
  selectedCourse: any; // Replace `any` with the appropriate type for course details
  onBack: () => void;
}

export default function UserRegisterList({
  selectedCourse,
  onBack,
}: UserRegisterListProps) {
  const { id } = useParams<{ id: string }>();
  const { getRegisteredUsers, loading } = useCourseService();
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      if (!id) return;
      try {
        const response = await getRegisteredUsers(id, 1, 10, true); // Gọi API với tham số đúng
        console.log(response);
        if (response?.users) {
          setRegisteredUsers(response.users); // Cập nhật danh sách học viên
        }
      } catch (err: any) {
        setError(err?.message || "Không thể tải danh sách học viên");
      }
    };

    fetchRegisteredUsers();
  }, [id, getRegisteredUsers]);
  return (
    <div className="py-8 px-4">
      <button
        className="mb-6 px-5 py-2 bg-white border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-colors shadow-sm"
        onClick={onBack}
      >
        ← Quay lại danh sách khóa học
      </button>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedCourse.title} - Danh sách học viên
        </h2>
      </div>
      {error && (
        <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-4">
          Đang tải danh sách học viên...
        </div>
      ) : registeredUsers.length === 0 ? (
        <div className="text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-4">
          Chưa có học viên nào đăng ký.
        </div>
      ) : (
        <ul className="space-y-4">
          {registeredUsers.map((user: any, idx: number) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="text-sm text-gray-500">#{idx + 1}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}