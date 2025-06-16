"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface item {
  name: string;
  icon: string;
  nav: string;
}

export default function SideItem({ name, icon, nav }: item) {
  const [item, setItem] = useState(false);

  function handleClick() {
    useEffect(() => {});
  }
  return (
    <Link
      href={" "}
      className="flex items-center pl-5 py-2"
      onClick={handleClick}
    >
      <img src={icon} alt="logo" className="w-7 h-7" />
      <div className=" ml-4 text-center text-white text-md font-['Anton'] tracking-widest">
        {name}
      </div>
    </Link>
  );
}
