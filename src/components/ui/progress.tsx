"use client";

interface ProgressBar {
  percent?: number;
  color?: string;
  height?: string;
  className?: string;
}

export default function ProgressBar({
  percent = 0,
  color = "#0077ff",
  height = "0.5rem",
  className,
}: ProgressBar) {
  return (
    <div
      className={`${className} bg-sfit-gray-200 h-4 rounded-2xl`}
      style={{ height }}
    >
      <div
        className="h-full rounded-2xl"
        style={{ width: `${percent}%`, backgroundColor: color, height }}
      ></div>
    </div>
  );
}
