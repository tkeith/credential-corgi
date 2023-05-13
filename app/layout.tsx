import "./globals.css";
import { GlobalStateProvider } from "./page";

export const metadata = {
  title: "Credential Corgi",
  description: "Created by the Corgi Team",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalStateProvider>
      <html lang="en">
        <body className={"bg-white"}>{children}</body>
      </html>
    </GlobalStateProvider>
  );
}
