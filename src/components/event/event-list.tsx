import { useEventService } from "@/hooks/use-event-service";
import EventItem from "@/components/event/event-item";
import Loading from "@/components/ui/loading";

interface EventListProps {
  status?: "ongoing" | "upcoming" | "past";
  searchTerm?: string;
}

export default function EventList({ status, searchTerm }: EventListProps) {
  const { events, loading, error, registerForEvent, fetchEvents } =
    useEventService();

  const handleRegister = async (eventId: number) => {
    try {
      // You would typically get userId from auth context
      const userId = 1; // Replace with actual user ID
      await registerForEvent(eventId, userId);
      alert("Đăng ký thành công!");
    } catch (error) {
      alert(
        "Đăng ký thất bại: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleInfo = (eventId: number) => {
    // Navigate to event details or show modal
    console.log("Show info for event:", eventId);
  };

  const handleAttendance = (eventId: number) => {
    // Handle attendance logic
    console.log("Mark attendance for event:", eventId);
  };

  // Filter events based on status and search term
  const filteredEvents = events.filter((event) => {
    const matchesStatus = !status || event.status === status;
    const matchesSearch =
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.requirements?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
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
          onRegister={handleRegister}
          onInfo={handleInfo}
          onAttendance={handleAttendance}
        />
      ))}
    </div>
  );
}
