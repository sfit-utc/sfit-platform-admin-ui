"use client";

import Image from "next/image";
import googleSVG from "@/assets/icons/google.svg";

type GoogleProps = {
  width: number;
  height: number;
  className?: string;
};

export default function Google({ width, height, className }: GoogleProps) {
  return (
    <Image
      src={googleSVG}
      alt="tim"
      height={height}
      width={width}
      className={className}
    />
  );
}
