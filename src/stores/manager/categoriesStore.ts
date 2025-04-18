import { create } from "zustand";
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth";
import { Category } from "@/types/menu/Categories"; 

interface CategoryStoreState {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  setCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryStoreState>((set) => ({
  categories: [],
  isLoading: true,

  fetchCategories: async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-categories`
      );
      const data = await res.json();

      if (res.ok && Array.isArray(data.categories)) {
        set({ categories: data.categories, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ isLoading: false });
    }
  },

  setCategories: (categories) => set({ categories }),
}));
