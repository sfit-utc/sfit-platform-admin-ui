import { LoaderCircle } from "lucide-react";

interface LoadingProp {
  className?: string;
}

export default function Loading({ className }: LoadingProp) {
  return (
    <div className={className}>
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
