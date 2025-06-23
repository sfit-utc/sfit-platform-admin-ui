"use client";

import Box from "@/components/ui/box";
import Status, { StatusColorKey } from "@/components/ui/status";

interface ClassItemProp {
  name: string;
  when: string;
  teacher: string;
  status?: keyof typeof statusState;
}

const statusState: Record<string, { status: string; color: StatusColorKey }> = {
  complete: {
    status: "Hoàn thành",
    color: "green",
  },
  "in-progress": {
    status: "Đang diễn ra",
    color: "yellow",
  },
};

export default function ClassItem({
  name,
  when,
  teacher,
  status,
}: ClassItemProp) {
  const statusObj = status ? statusState[status] : null;

  return (
    <Box>
      <h3 className="font-bold mb-2">{name}</h3>
      <p>{when}</p>
      <p>Giảng viên: {teacher}</p>
      {statusObj && (
        <Status className="mt-3 w-fit" color={statusObj.color}>
          {statusObj.status}
        </Status>
      )}
    </Box>
  );
}
