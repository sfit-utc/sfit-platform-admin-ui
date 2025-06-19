import NavBar from "@/components/NavBar/NavBar";
import SideBar from "@/components/SideBar/SideBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage",
  description: "Homepage of SFIT",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideBar />
      <div className="px-8 flex-col w-full">
        <NavBar />
        {children}
      </div>
    </div>
  );
}
