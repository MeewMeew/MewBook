import { defineStore } from 'pinia'

import type { Conversation } from '@/types/messenger'

export const useConversation = defineStore({
  id: 'conversations',
  state: () => ({ conversations: [] } as { conversations: Conversation[] })
})
