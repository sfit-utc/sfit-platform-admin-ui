"use client";

import Committee from "@/components/committee/Committee";
import CommitteeDetail from "@/components/committee/CommitteeDetail";
import { useSearchParams } from "next/navigation";

export default function CommitteePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="flex">
      {id ? <CommitteeDetail id={Number.parseInt(id)} /> : <Committee />}
    </div>
  );
}
