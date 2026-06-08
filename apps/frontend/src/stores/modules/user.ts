import { getUserInfoAPI } from '@/api'
import { getMeAPI } from '@/api/auth'
import { USER_ID } from '@/config/local-storage'
import { UserPublic } from '@knowledge_island/schemas'
import { create } from 'zustand'

// type Translator = ReturnType<typeof useTranslations<never>>

interface UserState {
  userInfo: UserPublic

  remove: () => void
  init: () => void
}

const emptyUserInfo = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  followCount: 0,
  fanCount: 0,
  sex: 0,
  signature: '',
}

export const useUserStore = create<UserState>((set) => ({
  userId: '',
  userInfo: emptyUserInfo,

  remove() {
    set({
      userInfo: emptyUserInfo,
    })
    localStorage.removeItem(USER_ID)
  },

  async init() {
    await getMeAPI()
      .then(async (res) => {
        const userId = res.data.data.id
        const userInfo = await getUserInfoAPI(userId)
        set({
          userInfo,
        })
      })
      .catch(() => {})
  },
}))
