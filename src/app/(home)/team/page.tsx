"use client";

import Committee from "@/components/committee/committee";
import CommitteeDetail from "@/components/committee/committee-detail";
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
