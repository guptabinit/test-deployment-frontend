import { create } from "zustand"
import { Hotel as Branch } from "@/types/Hotel"
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth";


interface BranchState {
  branches: Branch[]
  isLoadingBranches: boolean
  fetchBranches: () => Promise<void>
  setBranches: (branches: Branch[]) => void
}

export const useBranchStore = create<BranchState>((set) => ({
  branches: [],
  isLoadingBranches: false,

  fetchBranches: async () => {
    set({ isLoadingBranches: true })
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/fetch-hotels`
      )
      const data = await response.json()

      if (response.ok && Array.isArray(data.hotels)) {
        set({ branches: data.hotels })
      } else {
        console.error("Failed to load branches:", data)
      }
    } catch (error) {
      console.error("Error fetching branches:", error)
    } finally {
      set({ isLoadingBranches: false })
    }
  },

  setBranches: (branches) => set({ branches }),
}))
