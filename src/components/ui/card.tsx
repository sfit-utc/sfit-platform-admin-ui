"use client";

import CardTitle from "@/components/ui/card-title";
import Loading from "@/components/ui/loading";

interface CardProp {
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export default function Card({
  title,
  children,
  className,
  loading = false,
}: CardProp) {
  return (
    <div className={`${className} p-6 shadow rounded-2xl`}>
      <CardTitle>{title}</CardTitle>
      {loading ? (
        <Loading className="flex justify-center items-center" />
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
