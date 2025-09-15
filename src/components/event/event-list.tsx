import { useEventService } from "@/hooks/use-event-service";
import EventItem from "@/components/event/event-item";
import Loading from "@/components/ui/loading";
import { useEffect , useState } from "react";
import { EventStatus } from "@/types/event";
interface EventListProps {
  status?: EventStatus;
  searchTerm?: string;
  onChange?: () => void;
}

export default function EventList({ status, searchTerm, onChange }: EventListProps) {
  const { events, loading, error, fetchEvents, pagination } =
    useEventService();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages =
  pagination && pagination.page_size > 0 && pagination.total_count >= 0
    ? Math.ceil(pagination.total_count / pagination.page_size)
    : 1;
  const [inputPage, setInputPage] = useState(currentPage);
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchEvents({
      page: currentPage,
      page_size: 10,
      status: status ? status.toUpperCase() : undefined,
    });
  }, [status, fetchEvents, currentPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  const handleRegister = async (eventId: string) => {
    try {
      // You would typically get userId from auth context
      const userId = 1; // Replace with actual user ID
      // await registerForEvent(eventId, userId);
      alert("Đăng ký thành công!");
    } catch (error) {
      alert(
        "Đăng ký thất bại: " +
        (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleInfo = (eventId: string) => {
    // Navigate to event details or show modal
    console.log("Show info for event:", eventId);
  };

  const handleAttendance = (eventId: string) => {
    // Handle attendance logic
    console.log("Mark attendance for event:", eventId);
  };

  // Filter events based on status and search term
  const filteredEvents = events.filter((event) => {
    const matchesStatus = !status || event.status === status;
    const matchesSearch =
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Lỗi: {error}</div>;
  }
  if (filteredEvents.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        {searchTerm ? "Không tìm thấy sự kiện phù hợp" : "Không có sự kiện nào"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          status={status}
          onRegister={handleRegister}
          onInfo={handleInfo}
          onAttendance={handleAttendance}
          onChange={onChange}
        />
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Trước
          </button>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputPage}
            onChange={e => {
              const val = Number(e.target.value);
              setInputPage(val);
            }}
            onBlur={() => {
              if (inputPage < 1) setCurrentPage(1);
              else if (inputPage > totalPages) setCurrentPage(totalPages);
              else setCurrentPage(inputPage);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (inputPage < 1) setCurrentPage(1);
                else if (inputPage > totalPages) setCurrentPage(totalPages);
                else setCurrentPage(inputPage);
              }
            }}
            className="w-16 text-center border rounded"
          />
          <span>/ {totalPages}</span>
          <button
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Sau
          </button>
        </div>
      )}
    </div>
    
  );
}
