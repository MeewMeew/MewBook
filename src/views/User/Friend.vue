<script setup lang="ts">
import { debounce } from 'lodash'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { Attachment, Friend, User } from '@/database'
import { protectEmail } from '@/helpers/protected'
import type { IUser } from '@/types'

const router = useRouter()

const search = ref<string>('')
const friends = ref<IUser[]>([])
const fsearch = ref<IUser[]>([])

const hasFriendSearch = computed(() => {
  return fsearch.value.length > 0
})

async function loadFriends() {
  const id = router.currentRoute.value.params.id

  const f = await Friend.getByUID(parseInt(id as string))
  const users = await User.getAll()

  if (f && users.length > 0) {
    for (const user of users) {
      if (f.friends.includes(user.id.toString())) {
        if (Attachment.isID(user.photoURL)) {
          const attachment = await Attachment.get(user.photoURL)
          user.photoURL = await Attachment.cacheImage(attachment.attachments.large)
          friends.value.push(user)
        }
      }
    }
  }
}

onMounted(async () => {
  await loadFriends()
  fsearch.value = friends.value
})

watch(
  search,
  debounce(async (value) => {
    if (value === '') fsearch.value = friends.value
    else {
      fsearch.value = friends.value.filter((item) => {
        return item.displayName.toLowerCase().includes(value.toLowerCase())
      })
    }
  }, 300)
)
</script>
<template>
  <div class="w-full h-full rounded-lg bg-white my-4 p-5">
    <div class="flex flex-row items-center justify-between">
      <div class="select-none px-2">
        <span class="text-xl font-medium">Bạn bè</span>
      </div>
      <div class="flex flex-row space-x-3">
        <div
          class="flex bg-[#EFF2F5] items-center justify-start w-full rounded-full cursor-pointer py-1.5"
        >
          <i class="pi pi-search pl-3 mx-auto text-[#64676B] text-lg" />
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè"
            v-model="search"
            class="outline-none border-none h-3 bg-transparent w-full inline-block px-3 py-3"
          />
        </div>
        <div class="w-full">
          <router-link :to="{ name: 'friends' }">
            <Button label="Lời mời kết bạn" text size="small" />
          </router-link>
          <router-link :to="{ name: 'friends' }">
            <Button label="Tìm bạn bè" text size="small" />
          </router-link>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 h-full w-full gap-3 my-5" v-if="hasFriendSearch">
      <div class="h-[100px] w-full rounded-md border" v-for="(item, index) in fsearch" :key="index">
        <router-link :to="{ name: 'user', params: { id: item.id } }">
          <div
            class="flex flex-row items-center justify-start w-full h-full rounded-md cursor-pointer hover:bg-[#EFF2F5] transition-all space-x-5 px-5"
          >
            <div class="cursor-pointer">
              <Avatar
                :image="item.photoURL"
                size="xlarge"
                :pt="{
                  root: 'w-16 h-16',
                  image: 'rounded-lg w-full h-full'
                }"
              />
            </div>
            <div class="flex flex-col w-full space-y-1">
              <span class="text-[#050505] text-lg font-medium truncate">{{
                item.displayName
              }}</span>
              <span class="text-[#050505] text-md font-medium truncate">{{
                protectEmail(item.email, '*')
              }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center w-full h-full py-5" v-else>
      <span class="text-lg font-medium">Không có kết quả cho: {{ search }}</span>
    </div>
  </div>
</template>
