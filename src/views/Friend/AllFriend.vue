<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Avatar from 'primevue/avatar'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import NullStatePeople from '@/components/Icons/NullStatePeople.vue'
import { Attachment, Friend, User } from '@/database'
import FriendLayout from '@/layouts/FriendLayout.vue'
import { useUser } from '@/stores/user'
import { type IUser } from '@/types'

const router = useRouter()
const id = router.currentRoute.value.params.id! as string

const { cuser } = storeToRefs(useUser())
const fall = ref<IUser[]>([])

async function loadUsers() {
  const res = await Friend.getByUID(cuser.value?.id!)
  const users = await User.getAll()
  if (res && users.length > 0) {
    for (let user of users) {
      if (!user.verified) continue
      if (user.id === cuser.value?.id) continue
      if (res.friends.includes(user.id.toString())) {
        if (Attachment.isID(user.photoURL)) {
          const attachment = await Attachment.get(user.photoURL)
          user.photoURL = await Attachment.cacheImage(attachment.attachments.medium)
          fall.value.push(user)
        }
      }
    }
  }
}

onMounted(async () => {
  if (parseInt(id) === cuser.value!.id) {
    return router.push({ name: 'user', params: { id } })
  }
  await loadUsers()
})
</script>
<template>
  <FriendLayout>
    <template #sidebar>
      <div class="flex flex-col justify-between select-none">
        <div
          class="transition-all flex justify-start items-center space-x-3 pb-4 border-b-2 w-full drop-shadow-sm"
        >
          <router-link
            :to="{ name: 'friends' }"
            class="bg-zinc-50 hover:bg-zinc-200 flex h-10 w-10 rounded-full cursor-pointer select-none duration-300"
          >
            <i class="pi pi-arrow-left text-lg m-auto" :style="{ fontSize: 'large' }" />
          </router-link>
          <span class="text-2xl font-medium">Tất cả bạn bè</span>
        </div>
        <div class="h-[89vh] overflow-y-scroll nice-scrollbar">
          <div class="h-full flex flex-col w-full items-start rounded-lg transition-all">
            <div class="w-full px-2">
              <span class="text-lg font-medium">{{ fall.length }} bạn bè</span>
            </div>
            <router-link
              :to="{
                name: 'fall-view',
                params: { id: item.id }
              }"
              v-for="(item, index) in fall"
              :key="index"
              class="flex flex-row items-center w-full space-x-4 py-2 px-2 mb-1 hover:bg-zinc-100 rounded-lg duration-150 cursor-pointer"
            >
              <Avatar
                :image="item.photoURL"
                :pt="{ root: 'w-16 h-16', image: 'rounded-full w-full h-full' }"
              />
              <span class="text-lg font-medium">{{ item.displayName }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </template>
    <template #view>
      <router-view v-if="id" :key="id" />
      <div v-else class="h-full w-full justify-center items-center flex select-none">
        <div class="flex flex-col justify-center items-center space-y-4">
          <NullStatePeople size="120" />
          <span class="text-2xl font-medium text-mb-gray-2"
            >Chọn một người bạn để xem trước trang cá nhân.</span
          >
        </div>
      </div>
    </template>
  </FriendLayout>
</template>
