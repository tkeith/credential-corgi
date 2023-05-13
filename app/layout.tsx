"use client";

import "./globals.css";
import { GlobalStateProvider } from "./page";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalStateProvider>
      <html lang="en">
        <body className={"bg-white"}>{children}</body>
      </html>
    </GlobalStateProvider>
  );
}
