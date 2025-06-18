"use client";

import Image from "next/image";

type FacebookProps = {
  width: number;
  height: number;
  className?: string;
};

export default function Facebook({ width, height, className }: FacebookProps) {
  return (
    <Image
      src="/facebook.svg"
      alt="tim"
      height={height}
      width={width}
      className={className}
    />
  );
}
