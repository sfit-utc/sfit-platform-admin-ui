import { Event, EventStatus } from "@/types/event";

interface EventItemProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  onInfo?: (eventId: string) => void;
  onAttendance?: (eventId: string) => void;
}

export default function EventItem({
  event,
  onRegister,
  onInfo,
  onAttendance,
}: EventItemProps) {
  const handleRegister = () => {
    if (onRegister && event.id) {
      onRegister(event.id);
    }
  };

  const handleInfo = () => {
    if (onInfo && event.id) {
      onInfo(event.id);
    }
  };

  const handleAttendance = () => {
    if (onAttendance && event.id) {
      onAttendance(event.id);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isOngoing = event.status === "ONGOING";
  const isUpcoming = event.status === "UPCOMING";
  const isCompleted = event.status === "COMPLETED";
  return (
    <div
      className="px-11 py-6 m-2 w-full border-2 bg-white rounded-[5px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]"
      style={{
        backgroundColor: "var(--search-bg)",
      }}
    >
      <h1 className="text-3xl font-semibold font-inter">{event.title}</h1>
      <div className="text-gray-700 text-base font-inter mt-2">
        <span className="font-semibold">Thời gian diễn ra:</span>{" "}
        {formatDate(event.beginAt)} - {formatDate(event.endAt)}
      </div>
      <div className="text-gray-700 text-base font-inter">
        <span className="font-semibold">Địa điểm:</span> {event.location}
      </div>
      <div className="text-gray-700 text-base font-inter">
        <span className="font-semibold">Số lượng tham dự tối đa:</span> {event.maxPeople}
      </div>
      <div className="text-gray-700 text-base font-inter">
        <span className="font-semibold">Đơn vị tổ chức:</span> {event.agency}
      </div>
      <div className="text-gray-700 text-base font-inter">
        <span className="font-semibold">Loại sự kiện:</span> {event.type}
      </div>
      <div className="text-gray-700 text-base font-inter">
        <span className="font-semibold">Mô tả:</span> {event.description}
      </div>
      <div className="flex justify-between gap-4 mt-4">
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
          <button
            onClick={handleRegister}
            className="cursor-pointer w-52 h-9 bg-green-700 rounded-[20px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-green-800 transition-colors"
          >
            Đăng ký
          </button>
        )}

        {isCompleted && (
          <button
            onClick={handleAttendance}
            className="cursor-pointer w-52 h-9 bg-blue-600 rounded-[20px] flex items-center justify-center text-white text-base font-bold font-inter hover:bg-blue-700 transition-colors"
          >
            Xem điểm danh
          </button>
        )}
      </div>
    </div>
  );
}