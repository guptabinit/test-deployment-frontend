"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { SidebarProvider } from "./_components/sidebar-provider";
import "../globals.css";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hotelId } = useParams();

  const {
    fetchServicesAndMenu,
    fetchTags,
    fetchCustomization,
    fetchAboutHotel,
    fetchDialList,
    fetchPdfs,
  } = useHotelDataStore();

  useEffect(() => {
    if (hotelId) {
      const id = hotelId.toString();
      fetchServicesAndMenu(id);
      fetchTags(id);
      fetchCustomization(id);
      fetchAboutHotel(id);
      fetchDialList(id);
      fetchPdfs(id)
    }
  }, [hotelId]);

  return (
    <SidebarProvider>
      <div className="user-theme min-h-screen">{children}</div>
    </SidebarProvider>
  );
}
