import { useLessonService } from "@/hooks/use-lesson-service";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import { LessonAttendanceStatus } from "@/types/lesson";

interface LessonAttendentListProps {
    lessonId: string;
    moduleId: string;
    onBack: () => void;
}

export default function LessonAttendentList({
    lessonId,
    onBack,
}: LessonAttendentListProps) {
    const { getUsersByLessonId, updateStatusLessonAttendance } = useLessonService();
    const [attendees, setAttendees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAttendee, setSelectedAttendee] = useState<any | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        async function fetchAttendees() {
            try {
                const response = await getUsersByLessonId(lessonId, {
                    page: 1,
                    page_size: -1,
                });
                if (response && response.items) {
                    setAttendees(response.items);
                }
            } catch {
                setError("Không thể tải danh sách học viên.");
            } finally {
                setLoading(false);
            }
        }
        fetchAttendees();
    }, [lessonId, getUsersByLessonId]);

    if (loading) return <div>Đang tải danh sách học viên...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const handleEditAttendee = (attendee: any) => {
        setSelectedAttendee(attendee);
        setModalOpen(true);
    };

    const handleUpdateStatus = async (attendee: any, newStatus: LessonAttendanceStatus) => {
        try {
            await updateStatusLessonAttendance(attendee.id, lessonId, {
                status: newStatus,
                device_id: attendee.device_id || "",
                duration: attendee.duration || 0,
                answer: attendee.answer || [],
            });
            setAttendees((prev) =>
                prev.map((item) =>
                    item.userId === attendee.userId ? { ...item, status: newStatus } : item
                )
            );
        } catch {
            alert("Không thể cập nhật trạng thái học viên.");
        }
    };

    const handleUpdateAttendee = async (updatedData: any) => {
        if (!selectedAttendee) return;

        try {
            await updateStatusLessonAttendance(selectedAttendee.id, lessonId, {
                status: updatedData.status,
                device_id: updatedData.device_id || "",
                duration: updatedData.duration || 0,
                answer: updatedData.answer || [],
            });
            setAttendees((prev) =>
                prev.map((attendee) =>
                    attendee.userId === selectedAttendee.userId ? { ...attendee, ...updatedData } : attendee
                )
            );
            setModalOpen(false);
        } catch {
            alert("Không thể cập nhật thông tin học viên.");
        }
    };
    console.log(attendees);
    return (
        <div className="py-8 px-4">
            <button
                className="mb-6 px-5 py-2 bg-white border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-colors shadow-sm"
                onClick={onBack}
            >
                ← Quay lại bài giảng
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách học viên</h2>
            {attendees.length === 0 ? (
                <div className="text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    Không có học viên nào tham gia bài giảng này.
                </div>
            ) : (
                <ul className="space-y-4">
                    {attendees.map((attendee, idx) => (
                        <li
                            key={attendee.userId || idx}
                            className="flex items-center gap-4 px-4 py-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
                        >
                            <span className="text-green-600 font-semibold">{idx + 1}.</span>
                            <div className="flex-1">
                                <p className="text-gray-900 font-medium">{attendee.username}</p>
                                <p className="text-sm text-gray-500">{attendee.email}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900 font-medium">Điểm: {attendee.quiz_point}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900 font-medium">Thời gian học: {attendee.duration}</p>
                            </div>
                            <select
                                value={attendee.status}
                                onChange={(e) => handleUpdateStatus(attendee, e.target.value as LessonAttendanceStatus)}
                                className="px-3 py-1 text-sm rounded-full border border-gray-300"
                            >
                                <option value="present">Có mặt</option>
                                <option value="absent_excused">Vắng mặt (có lý do)</option>
                                <option value="absent_unexcused">Vắng mặt (không lý do)</option>
                                <option value="late">Đi trễ</option>
                            </select>
                            <button
                                onClick={() => handleEditAttendee(attendee)}
                                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Edit
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <Modal
                state={isModalOpen}
                funcClickToBack={setModalOpen}
                className="max-w-lg w-full overflow-y-auto max-h-[80vh]"
            >
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Chỉnh sửa thông tin học viên</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            const updatedData = {
                                status: formData.get("status"),
                                device_id: formData.get("device_id"),
                                duration: Number(formData.get("duration")),
                            };
                            handleUpdateAttendee(updatedData);
                        }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {/* Thiết bị */}
                        <div>
                            <label
                                htmlFor="device_id"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Thiết bị
                            </label>
                            <input
                                type="text"
                                id="device_id"
                                name="device_id"
                                defaultValue={selectedAttendee?.device_id}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Nhập thiết bị"
                            />
                        </div>

                        {/* Thời lượng */}
                        <div>
                            <label
                                htmlFor="duration"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Thời lượng (phút)
                            </label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                defaultValue={selectedAttendee?.duration}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Nhập thời lượng"
                            />
                        </div>

                        {/* Nút hành động */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}