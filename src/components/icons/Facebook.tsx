"use client";

import Image from "next/image";
import facebookSVG from "@/assets/icons/facebook.svg";

type FacebookProps = {
  width: number;
  height: number;
  className?: string;
};

export default function Facebook({ width, height, className }: FacebookProps) {
  return (
    <Image
      src={facebookSVG}
      alt="tim"
      height={height}
      width={width}
      className={className}
    />
  );
}
