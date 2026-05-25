import { USER_ID } from '@/config/local-storage'
import { create } from 'zustand'

interface UserState {
  userId: string

  setUserId: (userId: string) => void
  removeUserId: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: localStorage.getItem(USER_ID) || '',

  setUserId(userId) {
    set({
      userId,
    })
    localStorage.setItem(USER_ID, get().userId)
  },

  removeUserId() {
    set({
      userId: '',
    })
    localStorage.removeItem(USER_ID)
  },
}))
