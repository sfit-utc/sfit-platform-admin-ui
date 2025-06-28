"use client";

import Box from "@/components/ui/box";
import HighlightBox, { StatusColorKey } from "@/components/ui/highlightBox";

interface EventItemProp {
  eventTitle: string;
  when: string;
  howManyPeople?: number;
  status?: keyof typeof statusState;
}

const statusState: Record<string, { status: string; color: StatusColorKey }> = {
  complete: {
    status: "Đã xuất bản",
    color: "blue",
  },
  "in-progress": {
    status: "Đang diễn ra",
    color: "green",
  },
};

export default function EventItem({
  eventTitle,
  when,
  howManyPeople = 0,
  status,
}: EventItemProp) {
  const statusObj = status ? statusState[status] : null;

  return (
    <Box className="grid grid-cols-1">
      <div className="lg:flex justify-between">
        <div>{eventTitle}</div>
        {statusObj && (
          <HighlightBox className="w-fit" color={statusObj.color}>
            {statusObj.status}
          </HighlightBox>
        )}
      </div>
      <p className="text-sfit-red-500 text-xs">thời gian diễn ra: {when}</p>
      <p className="text-sfit-red-500 text-xs">
        Số lượng tham dự: {howManyPeople} người
      </p>
    </Box>
  );
}
