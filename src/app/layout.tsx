import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickGick",
  description: "Digital Menu Management System",
  icons: {
    icon: [
      { url: "/Quickgick-favicon-150x150.png", sizes: "150x150" },
    ],
    shortcut: "/Quickgick-favicon-150x150.png",
    apple: "/Quickgick-favicon-150x150.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster visibleToasts={1} position="top-right" richColors />
      </body>
    </html>
  );
}
