import { useCourseService } from "@/hooks/use-course-service";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { UploadIcon } from "lucide-react";
import { useAccounts } from "@/hooks/use-account-service";
import Modal from "@/components/ui/modal";
import { useExcelService } from "@/hooks/use-excel-service";

interface UserRegisterListProps {
  selectedCourse: any;
  onBack: () => void;
}

export default function UserRegisterList({
  selectedCourse,
  onBack,
}: UserRegisterListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const { data: accounts, loading: accountsLoading } = useAccounts();

  const { id } = useParams<{ id: string }>();
  const { getRegisteredUsers, loading, registerUserToCourse } = useCourseService();
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("LEARNED");
  const [excelFiles, setExcelFiles] = useState<File[]>([]);

  const {
    columnAData,
    handleReadColumnA,
  } = useExcelService();

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      if (!id) return;
      try {
        const response = await getRegisteredUsers(id, 1, 10, filter);
        setRegisteredUsers(response?.users || []);
      } catch (err: any) {
        setError(err?.message || "Không thể tải danh sách học viên");
      }
    };

    fetchRegisteredUsers();
  }, [id, getRegisteredUsers, filter]);

  const handleExcelDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
    );
    setExcelFiles((prev) => [...prev, ...files]);
  };

  const handleExcelSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
    );
    setExcelFiles((prev) => [...prev, ...files]);
  };

  const handleExcelUpload = async () => {
    try {
      if (excelFiles.length === 0) {
        setError("Vui lòng chọn ít nhất một file Excel.");
        return;
      }

      for (const file of excelFiles) {
        await handleReadColumnA(file); 
        console.log(`Dữ liệu từ cột A của file ${file.name}:`, columnAData);
        const validUserIds = columnAData.filter((userId) => userId !== null && userId !== undefined);
        if (validUserIds.length > 0) {
          const request = {
            course_id: id,
            msvs: validUserIds.map(String),
            status: "LEARNED",
          };
          console.log(request);
          await registerUserToCourse(request);
        }
      }

      const response = await getRegisteredUsers(id, 1, 10, filter);
      setRegisteredUsers(response?.users || []);

      setExcelFiles([]); 
      setIsExcelModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi xử lý file Excel:", error);
      setError("Đã xảy ra lỗi khi xử lý file Excel.");
    }
  };

  const handleAddUser = async (userId: string) => {
    try {
      const request = {
        course_id: id,
        user_ids: [userId],
        status: "LEARNED",
      };
      await registerUserToCourse(request);
      const response = await getRegisteredUsers(id, 1, 10, filter);
      setRegisteredUsers(response?.users || []);
      // setIsModalOpen(false); 
    } catch (err: any) {
      setError(err?.message || "Không thể thêm người dùng");
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const request = {
        course_id: id,
        user_ids: [userId],
        status: newStatus,
      };
      await registerUserToCourse(request);
      const response = await getRegisteredUsers(id, 1, 10, filter);
      setRegisteredUsers(response?.users || []);
      setRegisteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (err: any) {
      setError(err?.message || "Không thể cập nhật trạng thái");
    }
  };
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
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="LEARNED">Đã học</option>
          <option value="BLOCKED">Bị chặn</option>
          <option value="REQUEST">Yêu cầu</option>
        </select>
      </div>
      <div className="flex items-center justify-between mb-6 space-x-4">
        <button
          className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          + Thêm người dùng
        </button>
        <button
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          onClick={() => setIsExcelModalOpen(true)}
        >
          <UploadIcon className="w-5 h-5" />
          <span>Thêm bằng Excel</span>
        </button>
      </div>
      <Modal state={isExcelModalOpen} funcClickToBack={setIsExcelModalOpen}>
        <h3 className="text-xl font-bold mb-4">Thêm người dùng bằng Excel</h3>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleExcelDrop}
        >
          <p className="text-gray-500">Kéo thả file Excel vào đây</p>
          <p className="text-sm text-gray-400">Hoặc</p>
          <label
            htmlFor="select-excel"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer inline-block mt-2"
          >
            Chọn file từ máy tính
            <input
              id="select-excel"
              type="file"
              accept=".xlsx, .xls"
              multiple
              className="hidden"
              onChange={handleExcelSelect}
            />
          </label>
        </div>
        {excelFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Danh sách file đã chọn:</h4>
            <ul className="mt-2 space-y-1">
              {excelFiles.map((file, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {file.name}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={handleExcelUpload}
            >
              Tải lên
            </button>
          </div>
        )}
      </Modal>
      <Modal state={isModalOpen} funcClickToBack={setIsModalOpen}>
        <h3 className="text-xl font-bold mb-4">Thêm người dùng</h3>
        {accountsLoading ? (
          <div>Đang tải danh sách tài khoản...</div>
        ) : (
          <ul className="space-y-2">
            {accounts.map((account: any, index: number) => (
              <li
                key={account.id || index} // Sử dụng `index` làm fallback nếu `account.id` không hợp lệ
                className="flex items-center justify-between p-2 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-gray-500">{account.email}</p>
                </div>
                <button
                  className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  onClick={() => handleAddUser(account.userId)}
                >
                  Thêm
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
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
              <div className="flex items-center space-x-4">
                <select
                  className="px-2 py-1 border border-gray-300 rounded-lg"
                  value={filter || user.status}
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                >
                  {/* <option value="LEARN">Đang học</option> */}
                  <option value="LEARNED">Đã học</option>
                  <option value="BLOCKED">Bị chặn</option>
                  <option value="REQUEST">Yêu cầu</option>
                </select>
                <span className="text-sm text-gray-500">#{idx + 1}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}