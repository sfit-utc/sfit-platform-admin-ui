"use client";

import Image from "next/image";

type GoogleProps = {
  width: number;
  height: number;
  className?: string;
};

export default function Google({ width, height, className }: GoogleProps) {
  return (
    <Image
      src="/google.svg"
      alt="tim"
      height={height}
      width={width}
      className={className}
    />
  );
}
