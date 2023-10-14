<script setup lang="ts">
import { uniqBy } from 'lodash'
import { storeToRefs } from 'pinia'
import Divider from 'primevue/divider'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import NullStatePeople from '@/components/Icons/NullStatePeople.vue'
import Setting from '@/components/Icons/Setting.vue'
import UserCard from '@/components/User/UserCard.vue'
import { Attachment, Friend, User } from '@/database'
import FriendLayout from '@/layouts/FriendLayout.vue'
import { useUser } from '@/stores/user'
import { type IUser } from '@/types'

const router = useRouter()

const cname = router.currentRoute.value.name
const { cuser } = storeToRefs(useUser())

const frequest = ref<IUser[]>([])
const userSuggest = ref<IUser[]>([])
const crequest = ref<string[]>([])

const hasRequest = computed(() => frequest.value.length > 0)
const hasSuggest = computed(() => userSuggest.value.length > 0)

async function loadUsers() {
  const res = await Friend.getByUID(cuser.value?.id!)
  const users = await User.getAll()
  if (res && users.length > 0) {
    crequest.value = res.requested
    for (let user of users) {
      if (!user.verified) continue
      if (res.friends.includes(user.id.toString())) continue
      if (user.id === cuser.value?.id) continue
      if (Attachment.isID(user.photoURL)) {
        const attachment = await Attachment.get(user.photoURL)
        user.photoURL = await Attachment.image(attachment.attachments.medium)
      }
      if (res.received.includes(user.id.toString())) {
        frequest.value = uniqBy([...frequest.value, user], 'id')
        continue
      }
      userSuggest.value = uniqBy([...userSuggest.value, user], 'id')
    }
  }
}

function isRequest(id: number) {
  const include = crequest.value.includes(id.toString())
  return include
}

onMounted(async () => {
  await loadUsers()
})
</script>
<template>
  <FriendLayout>
    <template #sidebar>
      <div class="flex flex-row justify-between select-none px-3">
        <span class="text-2xl font-semibold">Bạn bè</span>
        <div
          class="flex justify-center items-center bg-zinc-200 hover:bg-zinc-300 rounded-full p-2 -mt-1 cursor-pointer"
        >
          <Setting />
        </div>
      </div>
      <div class="flex flex-col gap-2 mt-3 select-none transition-all">
        <router-link
          :to="{ name: 'friends' }"
          class="w-full h-14 hover:bg-zinc-100 rounded-lg flex flex-row justify-start items-center pl-2 duration-300"
        >
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center"
            :class="[cname === 'friends' ? 'bg-mb-blue' : 'bg-mb-gray']"
          >
            <img
              src="/icons/friend/friends.png"
              alt="friends"
              class="w-5 h-5"
              :class="[cname === 'friends' ? 'invert' : '']"
            />
          </div>
          <span class="text-md text-mb-gray-2 font-semibold text-center px-3">Trang chủ</span>
        </router-link>
        <router-link
          :to="{ name: 'frequest' }"
          class="w-full h-14 hover:bg-zinc-100 rounded-lg pl-2 duration-300 flex items-center"
        >
          <div class="flex flex-row justify-start items-center w-full">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center"
              :class="[cname === 'frequest' ? 'bg-mb-blue' : 'bg-mb-gray']"
            >
              <img
                src="/icons/friend/friends.png"
                alt="friends"
                class="w-5 h-5"
                :class="[cname === 'frequest' ? 'invert' : '']"
              />
            </div>
            <span class="text-md text-mb-gray-2 font-semibold text-center px-3"
              >Lời mời kết bạn</span
            >
          </div>
          <i class="pi pi-angle-right text-xl text-mb-gray-2 pr-3" />
        </router-link>
      </div>
    </template>
    <template #view>
      <div class="flex flex-col px-6 pt-3" v-if="hasRequest">
        <div class="flex flex-row">
          <span class="text-lg font-semibold">Lời mời kết bạn</span>
        </div>
        <div class="flex flex-row flex-wrap mt-5">
          <UserCard v-for="i of frequest" :key="i.id" :user="i" mode="request" class="mr-5" />
        </div>
        <Divider />
      </div>
      <div class="flex flex-col px-6 pt-3" v-if="hasSuggest">
        <div class="flex flex-row">
          <span class="text-lg font-semibold">Những người bạn có thể biết</span>
        </div>
        <div class="flex flex-row flex-wrap mt-5">
          <UserCard
            v-for="i of userSuggest"
            :key="i.id"
            :user="i"
            mode="suggest"
            :is-request="isRequest(i.id)"
            class="mr-5 mb-5"
          />
        </div>
        <Divider />
      </div>
      <div
        v-if="!hasRequest && !hasSuggest"
        class="flex flex-col justify-center items-center w-full h-full"
      >
        <NullStatePeople size="120" />
        <span class="text-xl font-semibold text-mb-gray-2">Không có lời mời kết bạn nào</span>
      </div>
    </template>
  </FriendLayout>
</template>
