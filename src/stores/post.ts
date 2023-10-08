import { defineStore } from 'pinia'

import type { IPost } from '@/types'

export const usePost = defineStore({
  id: 'posts',
  state: () =>
    ({ posts: [] } as { posts: IPost[] })
})
