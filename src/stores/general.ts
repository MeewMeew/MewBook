import { defineStore } from 'pinia'
export const useGeneral = defineStore('general', {
  state: () =>
    ({
      isPostOverlay: false,
      isCropperModal: false,
      isConversationSidebarOpen: false,
      isImageDisplay: null,
      loadingOnLogin: false,
      conversationColor: '#0084ff',
      notiCount: 0,
    } as {
      isPostOverlay: boolean
      isCropperModal: boolean
      isConversationSidebarOpen: boolean
      isImageDisplay: string | null
      loadingOnLogin: boolean
      conversationColor: string,
      notiCount: number,
    }),
  persist: true
})
