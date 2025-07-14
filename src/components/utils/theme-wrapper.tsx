"use client";

import { ThemeProvider } from "@/context/theme-context";
import { ReactNode } from "react";

export default function ThemeProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
