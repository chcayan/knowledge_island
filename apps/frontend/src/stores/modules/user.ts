import { getUserInfoAPI } from '@/api'
import { USER_ID } from '@/config/local-storage'
import { UserPublic } from '@knowledge_island/schemas'
import { create } from 'zustand'

interface UserState {
  userId: string
  userInfo: UserPublic

  setUserId: (userId: string) => void
  removeUserId: () => void
  init: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: '',
  userInfo: {
    id: '',
    name: '',
    email: '',
    avatar: '',
    followCount: 0,
    fanCount: 0,
    sex: 0,
    signature: '',
  },

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

  async init() {
    set({
      userId: localStorage.getItem(USER_ID) || '',
    })
    if (get().userId) {
      const userInfo = await getUserInfoAPI(get().userId)
      set({
        userInfo,
      })
    }
  },
}))
