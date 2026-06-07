import { getUserInfoAPI } from '@/api'
import { getMeAPI } from '@/api/auth'
import { USER_ID } from '@/config/local-storage'
import { FORBIDDEN_CODE, UNAUTHORIZED_CODE } from '@/config/request'
import { formatRemainTimeWithText } from '@/utils'
import { Toast } from '@/utils/toast'
import { UserPublic } from '@knowledge_island/schemas'
import { useTranslations } from 'next-intl'
import { create } from 'zustand'

type Translator = ReturnType<typeof useTranslations<never>>

interface UserState {
  userId: string
  userInfo: UserPublic

  setUserId: (userId: string) => void
  remove: () => void
  init: (t: Translator) => void
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

export const useUserStore = create<UserState>((set, get) => ({
  userId: '',
  userInfo: emptyUserInfo,

  setUserId(userId) {
    set({
      userId,
    })
    localStorage.setItem(USER_ID, get().userId)
  },

  remove() {
    set({
      userId: '',
      userInfo: emptyUserInfo,
    })
    localStorage.removeItem(USER_ID)
  },

  async init(t: Translator) {
    set({
      userId: localStorage.getItem(USER_ID) || '',
    })
    if (get().userId) {
      await getMeAPI()
        .then(async () => {
          const userInfo = await getUserInfoAPI(get().userId)
          set({
            userInfo,
          })
        })
        .catch((err) => {
          const status = err.status

          if (status === 401) {
            const code = err.response.data.code as typeof UNAUTHORIZED_CODE
            Toast.show({
              msg: t(`RequestError.401.${code}`),
              type: 'error',
            })
          } else if (status === 403) {
            const code = err.response.data.code as typeof FORBIDDEN_CODE
            const time = err.response.data.data.time
            Toast.show({
              msg: t(`RequestError.403.${code}`, {
                time: formatRemainTimeWithText(time, {
                  second: t('Global.date.timeUnit.second'),
                  minute: t('Global.date.timeUnit.minute'),
                  hour: t('Global.date.timeUnit.hour'),
                  day: t('Global.date.timeUnit.day'),
                }),
              }),
              type: 'error',
            })
          } else {
            Toast.show({
              msg: t('RequestError.401.401001'),
              type: 'error',
            })
          }
          useUserStore.getState().remove()
        })
    }
  },
}))
