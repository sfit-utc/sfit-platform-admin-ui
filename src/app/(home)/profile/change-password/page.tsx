"use client";

import { useAuth } from "@/hooks/use-auth";
import Loading from "@/components/ui/loading";
import ChangePasswordForm from "@/components/auth/change-password-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChangePasswordPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <Loading />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <ChangePasswordForm />
    </div>
  );
}
