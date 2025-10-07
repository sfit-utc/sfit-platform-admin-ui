"use client";

import Committee from "@/components/committee/committee";
import CommitteeDetail from "@/components/committee/committee-detail";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CommitteeContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="mt-4">
      {id ? <CommitteeDetail id={id} /> : <Committee />}
    </div>
  );
}

export default function CommitteePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommitteeContent />
    </Suspense>
  );
}