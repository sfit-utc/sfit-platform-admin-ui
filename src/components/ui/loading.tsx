import { LoaderCircle } from "lucide-react";

interface LoadingProp {
  className?: string;
  size?: number;
}

export default function Loading({ className, size }: LoadingProp) {
  return (
    <div className={className}>
      <LoaderCircle size={size} className="animate-spin" />
    </div>
  );
}
