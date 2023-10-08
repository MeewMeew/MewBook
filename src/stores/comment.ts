import { defineStore } from 'pinia'

export const useComment = defineStore({
  id: 'comments',
  state: () =>
    ({ commentSync: {} } as { commentSync: Record<string, number> })
})
