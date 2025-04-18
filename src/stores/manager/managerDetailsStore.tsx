import { create } from 'zustand'
import { fetchWithAuth } from '@/app/manager/_lib/fetch-with-auth'

const useManagerStore = create<any>((set) => ({
  manager: null as any,
  hotel: null as any,
  isHotelLoading: true,
  fetchManagerDetails: async () => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/get-manager`)
      if (!response.ok) {
        throw new Error('Failed to fetch manager details')
      }
      const data = await response.json()
      set({ manager: data.user, hotel: data.hotel, isHotelLoading: false })
    } catch (error) {
      console.error('Error fetching manager details:', error)
      set({ isHotelLoading: false })
    }
  }
}))

export default useManagerStore
