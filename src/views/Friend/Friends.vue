<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Divider from 'primevue/divider'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import Setting from '@/components/Icons/Setting.vue'
import { Attachment, Friend, User } from '@/database'
import { useUser } from '@/stores/user'
import { type IUser } from '@/types'
import FriendLayout from '@/views/Friend/FriendLayout.vue'

const router = useRouter()

const cname = router.currentRoute.value.name
const { cuser } = storeToRefs(useUser())

const frequest = ref<IUser[]>([])

const hasRequest = computed(() => frequest.value.length > 0)

async function loadFriendRequest() {
  const res = await Friend.getByUID(cuser.value?.id!)
  if (res) {
    for (let id of res.received) {
      const user = await User.get({ id: parseInt(id) })
      if (user) {
        if (Attachment.isID(user.photoURL)) {
          const attachment = await Attachment.get(user.photoURL)
          user.photoURL = await Attachment.image(attachment.attachments.medium)
          frequest.value = [...frequest.value, user]
        }
      }
    }
  }
}

onMounted(async() => {
  await loadFriendRequest()
})


</script>
<template>
  <FriendLayout>
    <template #sidebar>
      <div class="flex flex-row justify-between select-none">
        <span class="text-2xl font-bold">Bạn bè</span>
        <div class="flex justify-center items-center bg-zinc-200 hover:bg-zinc-300 rounded-full p-2 -mt-1 cursor-pointer">
          <Setting />
        </div>
      </div>
      <div class="flex flex-col gap-2 mt-3 select-none transition-all">
        <router-link :to="{ name: 'friends' }" class="w-full h-14 hover:bg-zinc-100 rounded-lg flex flex-row justify-start items-center pl-2 duration-300">
          <div class="w-9 h-9 rounded-full flex items-center justify-center" :class="[cname === 'friends' ? 'bg-mb-blue' : 'bg-mb-gray']">
            <img src="/icons/friend/friends.png" alt="friends" class="w-5 h-5" :class="[cname === 'friends' ? 'invert' : '']" />
          </div>
          <span class="text-md text-mb-gray-2 font-semibold text-center px-3">Trang chủ</span>
        </router-link>
        <router-link :to="{ name: 'friendrequest' }" class="w-full h-14 hover:bg-zinc-100 rounded-lg pl-2 duration-300 flex items-center">
          <div class="flex flex-row justify-start items-center w-full">
            <div class="w-9 h-9 rounded-full flex items-center justify-center" :class="[cname === 'friendrequest' ? 'bg-mb-blue' : 'bg-mb-gray']">
              <img src="/icons/friend/friends.png" alt="friends" class="w-5 h-5" :class="[cname === 'friendrequest' ? 'invert' : '']" />
            </div>
            <span class="text-md text-mb-gray-2 font-semibold text-center px-3">Lời mời kết bạn</span>
          </div>
          <i class="pi pi-angle-right text-xl text-mb-gray-2 pr-3"/>
        </router-link>
      </div>
    </template>
    <template #view>
      <div class="flex flex-col p-6" v-if="hasRequest">
        <div class="flex flex-row">
          <span class="text-lg font-semibold">Lời mời kết bạn</span>
        </div>
        <div class="flex flex-col md:grid gap-4 grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 mt-5">
          <!-- <CardFriend v-for="i of frequest" :key="i.id" :name="i.displayName" :image="i.photoURL" :id="i.id" /> -->
        </div>
        <Divider />
      </div>
      <div class="flex flex-col p-6">
        <div class="flex flex-row">
          <span class="text-lg font-semibold">Những người bạn có thể biết</span>
        </div>
        <div class="flex flex-col md:grid gap-4 grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 mt-5">
          <!-- <CardFriend v-for="i of users" :key="i.id" :name="i.displayName" :image="i.photoURL" :id="i.id" /> -->
        </div>
        <Divider />
      </div>
    </template>
  </FriendLayout>
</template>