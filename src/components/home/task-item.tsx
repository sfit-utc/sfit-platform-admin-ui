"use client";

import Box from "@/components/ui/box";
import ProgressBar from "@/components/ui/progress";
import Status from "@/components/ui/status";

interface TaskItemProp {
  title: string;
  expired: string;
  percentComplete?: number;
}

export default function TaskItem({
  title,
  expired,
  percentComplete = 0,
}: TaskItemProp) {
  return (
    <Box>
      <p>{title}</p>
      <p className="text-sfit-red-500 text-xs">{`Hạn: ${expired}`}</p>
      <div className="flex items-center">
        <ProgressBar className="flex-1/12" percent={percentComplete} />
        <div className="w-3/12 max-w-32">
          <Status
            className="w-fit ml-2 text-xs"
            color={percentComplete < 100 ? "yellow" : "green"}
          >
            {percentComplete < 100 ? "Đang thực hiện" : "Hoàn thành"}
          </Status>
        </div>
      </div>
      <p className="text-xs text-sfit-gray-700">{percentComplete}%</p>
    </Box>
  );
}
