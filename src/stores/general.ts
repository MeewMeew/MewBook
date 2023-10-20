import { defineStore } from 'pinia'

export const useGeneral = defineStore('general', {
  state: () =>
    ({
      isPostOverlay: false,
      isCropperModal: false,
      isPrivacyModal: false,
      privacyModalPid: '',
      notiCount: 0
    } as {
      isPostOverlay: boolean
      isCropperModal: boolean
      isPrivacyModal: boolean
      privacyModalPid: string
      notiCount: number
    })
})
