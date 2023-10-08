import { defineStore } from 'pinia'

import type { IUser } from '@/types'

export const useUser = defineStore({
  id: 'user',
  persist: true,
  state: () => ({
    cuser: null,
  } as { cuser: IUser | null }),
  actions: {
    setUser(user: IUser) {
      this.cuser = user
    }
  }
})