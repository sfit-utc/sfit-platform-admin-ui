"use client";

import Box from "@/components/ui/box";
import ProgressBar from "@/components/ui/progress";
import HighlightBox from "@/components/ui/highlightBox";

interface TaskItemProp {
  className?: string;
  title: string;
  expired: string;
  percentComplete?: number;
}

export default function TaskItem({
  className = "",
  title,
  expired,
  percentComplete = 0,
}: TaskItemProp) {
  return (
    <Box className={`${className}`}>
      <p>{title}</p>
      <p className="text-sfit-red-500 text-xs">{`Hạn: ${expired}`}</p>
      <div className="flex items-center">
        <ProgressBar className="flex-1/12" percent={percentComplete} />
        <div className="w-3/12 max-w-32">
          <HighlightBox
            className="w-fit ml-2 text-xs"
            color={percentComplete < 100 ? "yellow" : "green"}
          >
            {percentComplete < 100 ? "Đang thực hiện" : "Hoàn thành"}
          </HighlightBox>
        </div>
      </div>
      <p className="text-xs text-sfit-gray-700">{percentComplete}%</p>
    </Box>
  );
}
