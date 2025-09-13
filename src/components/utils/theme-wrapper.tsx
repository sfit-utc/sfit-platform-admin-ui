"use client";

import { ThemeProvider } from "@/context/theme-context";
import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";

export default function ThemeProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
