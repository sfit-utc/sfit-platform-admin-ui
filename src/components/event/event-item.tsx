import { Event, EventStatus, EventDetailRp, UpdateEventRequest } from "@/types/event";
import { useState } from "react";
import { useEffect } from "react";
import { useEventService } from "@/hooks/use-event-service";
import { useTaskService } from "@/hooks/use-task-service";
interface EventItemProps {
  event: Event;
  status?: EventStatus;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onRegister?: (eventId: string) => void;
  onInfo?: (eventId: string) => void;
  onAttendance?: (eventId: string) => void;
  onChange?: () => void;
}


function EventDetailModal({
  event,
  onClose,
  onEdit,
  onChange,
}: {
  event: EventDetailRp | null;
  onClose: () => void;
  onEdit?: (eventId: string) => void;
  onChange?: () => void;
}) {
  const { updateEvent } = useEventService();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<UpdateEventRequest | null>(null);
  useEffect(() => {
    console.log(event);
    if (event) {
      setForm({
        title: event.Title,
        type: event.Type,
        description: event.Description,
        priority: event.Priority,
        location: event.Location,
        max_people: event.MaxPeople,
        agency: event.Agency,
        status: event.Status,
        begin_at: event.BeginAt,
        end_at: event.EndAt,
      });
    }
  }, [event]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    try {
      await updateEvent(event.ID, form);
      setEditMode(false);
      onChange && onChange();
      onClose();
    } catch {
      alert("Cập nhật sự kiện thất bại!");
    }
  };
  if (!event) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      style={{
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0,0,0,0.05)",
      }}>
      <div className="bg-white rounded-lg p-8 min-w-[400px] shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {editMode ? (
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          ) : (
            event.Title || event.title
          )}
        </h2>
        <div>
          <b>Loại:</b>{" "}
          {editMode ? (
            <input name="type" value={form.type} onChange={handleChange} className="border px-2 py-1 w-full" />
          ) : (
            event.Type || event.type
          )}
        </div>
        <div>
          <b>Mô tả:</b>{" "}
          {editMode ? (
            <textarea name="description" value={form.description} onChange={handleChange} className="border px-2 py-1 w-full" />
          ) : (
            event.Description || event.description
          )}
        </div>
        <div>
          <b>Độ ưu tiên:</b>{" "}
          {editMode ? (
            <input name="priority" type="number" value={form.priority} onChange={handleChange} className="border px-2 py-1 w-full" />
          ) : (
            event.Priority || event.priority
          )}
        </div>
        <div>
          <b>Địa điểm:</b>{" "}
          {editMode ? (
            <input name="location" value={form.location} onChange={handleChange} className="border px-2 py-1 w-full" />
          ) : (
            event.Location || event.location
          )}
        </div>
        <div>
          <b>Số lượng tham dự:</b>{" "}
          {editMode ? (
            <input name="max_people" type="number" value={form.max_people} onChange={handleChange} className="border px-2 py-1 w-full" />
          ) : (
            event.MaxPeople || event.max_people
          )}
        </div>
        <div>
          <b>Đơn vị tổ chức:</b>{" "}
          {editMode ? (
            <input name="agency" value={form.agency} onChange={handleChange} className="border px-2 py-1 w-full" />
          ) : (
            event.Agency || event.agency
          )}
        </div>
        <div>
          <b>Trạng thái:</b>{" "}
          {editMode ? (
            <input name="status" value={form.status} onChange={handleChange} className="border px-2 py-1 w-full" />
          ) : (
            event.Status || event.status
          )}
        </div>
        <div>
          <b>Bắt đầu:</b>{" "}
          {editMode ? (
            <input name="begin_at" value={form.begin_at} onChange={handleChange} className="border px-2 py-1 w-full" />
          ) : (
            formatDateTime(event.BeginAt || event.begin_at)
          )}
        </div>
        <div>
          <b>Kết thúc:</b>{" "}
          {editMode ? (
            <input name="end_at" value={form.end_at} onChange={handleChange} className="border px-2 py-1 w-full" />
          ) : (
            formatDateTime(event.EndAt || event.endAt || event.end_at)
          )}
        </div>
        <div>
          <b>Ngày tạo:</b> {formatDateTime(event.CreatedAt || event.created_at)}
        </div>
        <div>
          <b>Ngày cập nhật:</b> {formatDateTime(event.UpdatedAt || event.updated_at)}
        </div>
        <div>
          <b>Tags:</b> {event.tags?.join(", ")}
        </div>
        <div className="flex gap-2 mt-6">
          {editMode ? (
            <>
              <button
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-bold"
                onClick={handleSave}
              >
                Lưu
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 font-bold"
                onClick={() => setEditMode(false)}
              >
                Hủy
              </button>
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 font-bold"
                onClick={() => setEditMode(true)}
              >
                Sửa
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 font-bold"
                onClick={onClose}
              >
                Đóng
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    " " +
    pad(date.getDate()) +
    "/" +
    pad(date.getMonth() + 1) +
    "/" +
    date.getFullYear()
  );
};
export default function EventItem({
  event,
  status,
  onRegister,
  onInfo,
  onAttendance,
  onEdit,
  onDelete,
  onChange,
}: EventItemProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState<EventDetailRp | null>(null);
  const { events, deleteEvent, updateEvent, fetchEventDetail } = useEventService();
  const { tasks, fetchTasksByEventID, deleteTask } = useTaskService();
  const [loadingDetail, setLoadingDetail] = useState(false);


  const handleRegister = () => {
    if (onRegister && event.id) {
      onRegister(event.id);
    }
  };
  const handleInfo = async () => {
    setLoadingDetail(true);
    try {
      const detailData = await fetchEventDetail(event.id);
      setDetail(detailData);
      setShowDetail(true);
      if (onInfo && event.id) {
        onInfo(event.id);
      }
    } catch (e) {
      alert("Không thể tải chi tiết sự kiện.");
    } finally {
      setLoadingDetail(false);
    }
  };
  const handleAttendance = () => {
    if (onAttendance && event.id) {
      onAttendance(event.id);
    }
  };


  const handleEdit = () => {
    if (onEdit && event.id) {
      onEdit(event.id);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      // Lấy danh sách task mới nhất từ API
      const res = await fetchTasksByEventID(eventId, { page: 1, page_size: -1 });
      const taskList = res?.items || [];
      console.log(taskList);
      if (taskList.length > 0) {
        for (const task of taskList) {
          await deleteTask(task.ID);
        }
      }
      await deleteEvent(eventId);
      if (onDelete) onDelete(eventId);
      if (onChange) onChange();
    }
  };

  const isOngoing = status === "ONGOING";
  const isPast = status === "COMPLETED";
  const isUpcoming = status === "UPCOMING";
  return (
    <div
      className="px-11 py-6 m-2 w-full border-2 bg-white rounded-[5px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"
      style={{
        backgroundColor: "var(--search-bg)",
      }}
    >
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="text-3xl font-semibold font-inter">{event.title}</h1>
          <div className="text-red-600 text-xl font-normal font-inter">
            Thời gian diễn ra: {formatDateTime(event.begin_at)}
          </div>
          <div className="text-red-600 text-xl font-normal font-inter">
            Địa điểm: {event.location}
          </div>
          <div className="text-red-600 text-xl font-normal font-inter">
            Số lượng tham dự: {event.max_people}
          </div>
          <div className="text-red-600 text-xl font-normal font-inter">
            Yêu cầu về sự kiện: {event.description}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => event.id && handleDelete(event.id)}
            className="cursor-pointer px-4 h-9 bg-red-600 rounded-[5px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-red-700 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
      <div className="flex justify-between gap-4 mt-4">
        <button
          onClick={handleInfo}
          className="cursor-pointer w-52 h-9 bg-gray-700 rounded-[20px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-gray-800 transition-colors"
        >
          Xem chi tiết
        </button>
        {isOngoing && (
          <>
            <button
              onClick={handleInfo}
              className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-green-800 transition-colors"
            >
              Thông tin đăng ký
            </button>
            <button
              onClick={handleAttendance}
              className="cursor-pointer px-3 h-9 bg-blue-600 rounded-[5px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-blue-700 transition-colors"
            >
              Điểm danh
            </button>
          </>
        )}

        {isUpcoming && (
          <>
            <button
              onClick={handleRegister}
              className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-green-800 transition-colors"
            >
              Đăng ký
            </button>
          </>
        )}

        {isPast && (
          <>
            <button
              onClick={handleAttendance}
              className="cursor-pointer w-52 h-9 bg-blue-600 rounded-[20px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-blue-700 transition-colors"
            >
              Xem điểm danh
            </button>
          </>
        )}
      </div>
      {showDetail && (
        <EventDetailModal
          event={detail}
          onClose={() => setShowDetail(false)}
          onEdit={onEdit}
          onChange={onChange}
        />
      )}
    </div>

  );
}
