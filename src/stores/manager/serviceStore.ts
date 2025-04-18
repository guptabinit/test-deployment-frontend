import { create } from "zustand";
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth";
import { toast } from "sonner";
import { Service } from "@/types/menu/Services";

interface ServiceStore {
  services: Service[];
  isLoading: boolean;
  fetchServices: () => Promise<void>;
  setServices: (services: Service[]) => void;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  isLoading: true,

  fetchServices: async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-services`
      );
      const data = await res.json();

      if (res.ok && Array.isArray(data.services)) {
        set({ services: data.services, isLoading: false });
      } else {
        throw new Error(data.message || "Unable to fetch services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
      set({ services: [], isLoading: false });
    }
  },

  setServices: (services) => set({ services }),
}));
