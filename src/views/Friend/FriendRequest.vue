<script setup lang="ts">
import { uniqBy } from 'lodash'
import { storeToRefs } from 'pinia'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import NullStatePeople from '@/components/Icons/NullStatePeople.vue'
import { Attachment, Friend, User } from '@/database'
import { Logger } from '@/helpers/logger'
import { mewSocket } from '@/helpers/socket'
import FriendLayout from '@/layouts/FriendLayout.vue'
import { useUser } from '@/stores/user'
import { type IUser, NotificationType, SEvent } from '@/types'

const router = useRouter()
const id = router.currentRoute.value.params.id! as string

const { cuser } = storeToRefs(useUser())
const frequest = ref<IUser[]>([])
const loading = reactive<{
  accept: Record<string, boolean>
  reject: Record<string, boolean>
}>({
  accept: {},
  reject: {}
})

const is = reactive<{
  accept: Record<string, boolean>
  reject: Record<string, boolean>
  friend: Record<string, boolean>
}>({
  accept: {},
  reject: {},
  friend: {}
})

async function loadUsers() {
  const res = await Friend.getByUID(cuser.value?.id!)
  const users = await User.getAll()
  if (res && users.length > 0) {
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
        is.friend[user.id.toString()] = false
      }
    }
  }
}

const acceptRequest = async (id: number) => {
  loading.accept[id.toString()] = true
  try {
    const event = await Friend.accept(cuser.value!.id, id)
    if (event) {
      mewSocket.emit(SEvent.FRIEND_ACCEPT, event)
      is.friend[id.toString()] = true
    }
  } catch (error) {
    Logger.error(error)
  } finally {
    loading.accept[id.toString()] = false
  }
}

const rejectRequest = async (id: number) => {
  loading.reject[id.toString()] = true
  try {
    const event = await Friend.reject(cuser.value!.id, id)
    if (event) {
      mewSocket.emit(SEvent.FRIEND_REJECT, event)
      frequest.value = frequest.value.filter((user) => user.id !== id)
      is.reject[id.toString()] = true
    }
  } catch (error) {
    Logger.error(error)
  } finally {
    loading.reject[id.toString()] = false
  }
}

onMounted(async () => {
  if (parseInt(id) === cuser.value!.id) {
    return router.push({ name: 'user', params: { id } })
  }
  await loadUsers()

  mewSocket.on(SEvent.NOTIFICATION_CREATE, (data) => {
    if (data.aid === data.data.uid) return

    console.log(data)

    switch (data.type) {
    case NotificationType.FRIEND_ACCEPT:
      is.friend[data.data.uid.toString()] = true
      break

    case NotificationType.FRIEND_REJECT:
      is.reject[data.data.uid.toString()] = false
      break
    default:
      break
    }
  })
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
          <span class="text-2xl font-medium">Lời mời kết bạn</span>
        </div>
        <div class="h-[89vh] overflow-y-scroll nice-scrollbar">
          <div class="h-full flex flex-col w-full items-start rounded-lg transition-all">
            <div class="w-full px-2">
              <span class="text-lg font-medium">{{ frequest.length }} lời mời kết bạn</span>
            </div>
            <div
              class="flex flex-row items-center w-full space-x-2 py-2 px-2 mb-1 hover:bg-zinc-100 rounded-lg duration-150 cursor-pointer"
              v-for="(user, index) in frequest"
              :key="index"
            >
              <router-link
                :to="{ name: 'frequest-view', params: { id: user.id } }"
                class="relative w-14 h-14 cursor-pointer mr-2"
              >
                <Avatar
                  :image="user.photoURL"
                  :pt="{ root: 'w-16 h-16', image: 'rounded-full w-full h-full' }"
                />
              </router-link>
              <div class="flex flex-col w-full space-y-1">
                <span class="text-[#050505] text-lg font-medium truncate">{{
                  user.displayName
                }}</span>
                <div
                  class="flex flex-row justify-between items-center w-full space-x-2"
                  v-if="
                    !is.friend[user.id.toString()] &&
                    !is.accept[user.id.toString()] &&
                    !is.reject[user.id.toString()]
                  "
                >
                  <Button
                    aria-label="Chấp nhận"
                    class="space-x-2 w-1/2 justify-center py-2"
                    size="small"
                    :loading="loading.accept[user.id.toString()]"
                    @click="acceptRequest(user.id)"
                  >
                    <i v-if="loading.accept[user.id.toString()]" class="pi pi-spin pi-spinner"></i>
                    <span class="font-medium text-[16px]">Chấp nhận</span>
                  </Button>
                  <Button
                    aria-label="Từ chối"
                    class="space-x-2 w-1/2 justify-center bg-mb-gray hover:bg-mb-gray-h border-mb-gray"
                    size="small"
                    severity="secondary"
                    :loading="loading.reject[user.id.toString()]"
                    @click="() => rejectRequest(user.id)"
                  >
                    <i
                      v-if="loading.reject[user.id.toString()]"
                      class="pi pi-spin pi-spinner text-mb-gray-2"
                    ></i>
                    <span class="font-medium text-[16px] text-center text-mb-gray-2">Từ chối</span>
                  </Button>
                </div>
                <div v-else>
                  <span
                    class="text-[#65676B] text-md font-medium truncate"
                    v-if="is.friend[user.id.toString()]"
                    >Đã là bạn bè</span
                  >
                  <span
                    class="text-[#65676B] text-md font-medium truncate"
                    v-else-if="is.accept[user.id.toString()]"
                    >Đã chấp nhận lời mời</span
                  >
                  <span
                    class="text-[#65676B] text-md font-medium truncate"
                    v-else-if="is.reject[user.id.toString()]"
                    >Đã từ chối lời mời</span
                  >
                </div>
              </div>
            </div>
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
