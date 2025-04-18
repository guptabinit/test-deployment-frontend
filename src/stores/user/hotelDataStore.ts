import { create } from "zustand";
import { Customization } from "@/types/Customization";
import { Service } from "@/types/menu/Services";
import { About } from "@/types/About";
import { Contact } from "@/types/Contact";
import { Pdf } from "@/types/Pdf";
import { Category } from "@/types/menu/Categories";
import { SubCategory } from "@/types/menu/SubCategories";
import { Item } from "@/types/menu/Items";
import { Tag } from "@/types/Tag";

interface HotelDataState {
  services: Service[];
  categories: Category[];
  subCategories: SubCategory[];
  items: Item[];
  tags: Tag[];
  customization: Customization | undefined;
  aboutHotel: About | undefined;
  dialList: Contact[];
  pdfs: Pdf[];

  isCustomizationLoaded: boolean;
  isMenuLoaded: boolean;
  isTagsLoaded: boolean;
  isAboutLoaded: boolean;
  isDialerLoaded: boolean;
  isPdfLoaded: boolean;

  fetchServicesAndMenu: (hotelId: string) => Promise<void>;
  fetchTags: (hotelId: string) => Promise<void>;
  fetchCustomization: (hotelId: string) => Promise<void>;
  fetchAboutHotel: (hotelId: string) => Promise<void>;
  fetchDialList: (hotelId: string) => Promise<void>;
  fetchPdfs: (hotelId: string) => Promise<void>;

  setServices: (services: Service[]) => void;
  setTags: (tags: Tag[]) => void;
  setCustomization: (customization: Customization) => void;
  setAboutHotel: (about: About) => void;
  setDialList: (dialList: Contact[]) => void;
  setPdfs: (pdfs: Pdf[]) => void;
}

export const useHotelDataStore = create<HotelDataState>((set) => ({
  services: [],
  categories: [],
  subCategories: [],
  items: [],
  tags: [],
  customization: undefined,
  aboutHotel: undefined,
  dialList: [],
  pdfs: [],

  isCustomizationLoaded: false,
  isMenuLoaded: false,
  isTagsLoaded: false,
  isAboutLoaded: false,
  isDialerLoaded: false,
  isPdfLoaded: false,

  fetchServicesAndMenu: async (hotelId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/customer/get-menu/${hotelId}`
      );
      const data = await res.json();

      if (res.ok) {
        set({
          services: data.fullMenu.services,
          categories: data.fullMenu.categories,
          subCategories: data.fullMenu.subCategories,
          items: data.fullMenu.items,
          isMenuLoaded: true,
        });
      }
    } catch (err) {
      console.error("Error fetching services/menu:", err);
    }
  },

  fetchTags: async (hotelId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/customer/get-tags/${hotelId}`
      );
      const data = await res.json();

      if (res.ok) {
        set({
          tags: data.tags,
          isTagsLoaded: true,
        });
      }
    }
    catch (err) {
      console.error("Error fetching tags:", err);
    }
  },

  fetchCustomization: async (hotelId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/customer/get-customization/${hotelId}`
      );
      const data = await res.json();

      if (res.ok) {
        set({
          customization: data.customization,
          isCustomizationLoaded: true,
        });
      }
    } catch (err) {
      console.error("Error fetching customization:", err);
    }
  },

  fetchAboutHotel: async (hotelId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/customer/get-about/${hotelId}`
      );
      const data = await res.json();

      if (res.ok) {
        set({
          aboutHotel: data.about,
          isAboutLoaded: true,
        });
      }
    } catch (err) {
      console.error("Error fetching about hotel:", err);
    }
  },

  fetchDialList: async (hotelId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/customer/get-dialer/${hotelId}`
      );
      const data = await res.json();

      if (res.ok) {
        set({
          dialList: data.dialer.contacts,
          isDialerLoaded: true,
        });
      }
    } catch (err) {
      console.error("Error fetching dialer list:", err);
    }
  },

  fetchPdfs: async (hotelId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/customer/get-pdfs/${hotelId}`
      );
      const data = await res.json();

      if (res.ok) {
        set({
          pdfs: data.pdfs,
          isPdfLoaded: true,
        });
      }
    } catch (err) {
      console.error("Error fetching PDFs:", err);
    }
  },

  setServices: (services) => set({ services }),
  setTags: (tags) => set({ tags }),
  setCustomization: (customization) => set({ customization }),
  setAboutHotel: (about) => set({ aboutHotel: about }),
  setDialList: (dialList) => set({ dialList }),
  setPdfs: (pdfs) => set({ pdfs }),
}));
