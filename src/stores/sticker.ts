import { defineStore } from 'pinia'

import { type StickerCollections } from '@/types'

export const useSticker = defineStore({
  id: 'stickers',
  persist: true,
  state: () =>
    ({ stickers: [] } as { stickers: StickerCollections })
})
