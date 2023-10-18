<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import UserHeader from '@/components/User/UserHeader.vue'
import UserProfile from '@/components/User/UserProfile.vue'
import { Attachment, Friend, Post, User } from '@/database'
import { useUser } from '@/stores/user'
import type { IAttachmentItem, IUser } from '@/types'

const { cuser } = storeToRefs(useUser())

const router = useRouter()
const userId = +router.currentRoute.value.params.id
const user = ref<IUser>()
const images = ref<{ id: number; image: string }[]>([])
const is = reactive({
  friend: false,
  self: false
})

onMounted(async () => {
  if (cuser.value?.id === userId) {
    user.value = cuser.value
    is.self = true
  } else {
    const userDb = await User.get({ id: userId })
    if (userDb) user.value = userDb
    else return router.push({ name: 'dashboard' })
    is.friend = await Friend.isFriend(cuser.value!.id, userId)
  }

  const posts = await Post.getAll({
    uid: userId,
    limit: 20,
    sort: 'created_at',
    order: 'desc',
    attachment: true
  })

  for (const post of posts) {
    if (post.attachment) {
      const medium = await Attachment.cacheImage((post.attachment as IAttachmentItem).large)
      if (images.value.length === 9) break
      else images.value.push({ id: post.id, image: medium })
    }
  }
})
</script>

<template>
  <div class="w-full min-h-[100vh] pb-20 bg-[#F1F2F5] min-w-sm" v-if="cuser">
    <UserHeader v-if="user" :user="user" :tab="($route.name as string)" />

    <div
      class="flex-cols md:flex w-full max-w-xl justify-between h-[calc(100%-56px)] md:px-0 px-2 mx-auto"
      v-if="user"
    >
      <!-- <router-view :key="($route.params.id as string)" v-if="$route.name !== 'user'" /> -->
      <UserProfile :user="user" />
    </div>
  </div>
</template>
