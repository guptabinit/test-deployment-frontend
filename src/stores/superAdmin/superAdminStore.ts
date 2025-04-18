import { create } from "zustand"
import { fetchWithAuth } from "@/app/manager/_lib/fetch-with-auth"
import { SuperAdmin } from "@/types/SuperAdmin"

interface SuperAdminState {
  adminInfo: SuperAdmin | null
  isLoadingAdminInfo: boolean
  fetchAdminInfo: () => Promise<void>
  setAdminInfo: (info: SuperAdmin) => void
}

export const useSuperAdminStore = create<SuperAdminState>((set) => ({
  adminInfo: null,
  isLoadingAdminInfo: true,

  fetchAdminInfo: async () => {
    set({ isLoadingAdminInfo: true })
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/quickgick/get-admin-info`
      )
      const data = await response.json()

      if (response.ok && data?.superAdmin) {
        set({ adminInfo: data.superAdmin })
      } else {
        console.error("Failed to load admin info:", data)
      }
    } catch (error) {
      console.error("Error fetching admin info:", error)
    } finally {
      set({ isLoadingAdminInfo: false })
    }
  },

  setAdminInfo: (info) => set({ adminInfo: info }),
}))
