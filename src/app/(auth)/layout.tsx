import type { Metadata } from "next";
import Image from "next/image";
import bgclb from "@/assets/images/auth/bgclb.webp";

export const metadata: Metadata = {
  title: "Authentication - SFIT Platform",
  description: "Login or register to access SFIT Platform",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 p-12 items-center justify-center relative overflow-hidden">
          {/* Background Illustration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={bgclb}
              alt="Learning illustration"
              width={4086}
              height={2731}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-sfit-primary-0">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
