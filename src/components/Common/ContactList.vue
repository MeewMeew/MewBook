<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button'
import Divider from 'primevue/divider';
import { onMounted, reactive, ref } from 'vue'

import { Attachment, Friend, User } from '@/database';
import { Logger } from '@/helpers/logger';
import { mewSocket } from '@/helpers/socket';
import { useUser } from '@/stores/user';
import{ type IUser, SEvent } from '@/types';

const { cuser } = storeToRefs(useUser())
const friends = ref<IUser[]>([])
const receives = ref<IUser[]>([])
const loading = reactive({
  accept: false,
  reject: false
})

async function loadContacts() {
  const res = await Friend.getByUID(cuser.value?.id!)
  if (res) {
    for (let id of res.friends) {
      const user = await User.get({ id: parseInt(id) })
      if (user) {
        if (Attachment.isID(user.photoURL)) {
          const attachment = await Attachment.get(user.photoURL)
          user.photoURL = await Attachment.image(attachment.attachments.medium)
          friends.value = [...friends.value, user]
        }
      }
    }

    for (let id of res.received) {
      const user = await User.get({ id: parseInt(id) })
      if (user) {
        if (Attachment.isID(user.photoURL)) {
          const attachment = await Attachment.get(user.photoURL)
          user.photoURL = await Attachment.image(attachment.attachments.medium)
          receives.value = [...receives.value, user]
        }
      }
    }
  }
}

async function acceptRequest(id: number) { 
  try {
    loading.accept = true
    const event = await Friend.accept(cuser.value!.id, id)
    mewSocket.emit(SEvent.FRIEND_ACCEPT, event)
    receives.value = receives.value.filter(i => i.id !== id)
    loading.accept = false
  } catch (error) {
    Logger.error(error)
  } finally {
    await loadContacts()
  }
}
async function rejectRequest(id: number) { 
  try {
    loading.reject = true
    const event = await Friend.reject(cuser.value!.id, id)
    mewSocket.emit(SEvent.FRIEND_REJECT, event)
    receives.value = receives.value.filter(i => i.id !== id)
    loading.reject = false
  } catch (error) {
    Logger.error(error)
  } finally {
    await loadContacts()
  }
}

onMounted(async () => {
  await loadContacts()
})

</script>
<template>
  <div class="h-full top-14 hidden sticky">
    <div class="flex pt-10 flex-col w-full">
      <div class="flex flex-col">
        <div class="w-full flex flex-row justify-between px-2 space-x-1">
          <span class="text-[#65676B] font-medium">Người liên hệ</span>
          <div class="flex flex-row justify-between items-center space-x-1">
            <div class="hover:bg-zinc-300 rounded-full w-[36px] h-[36px] flex justify-center items-center cursor-pointer">
              <i class="pi pi-video text-xl text-[#65676B]" />
            </div>
            <div class="hover:bg-zinc-300 rounded-full w-[36px] h-[36px] flex justify-center items-center cursor-pointer">
              <i class="pi pi-search text-xl text-[#65676B]" />
            </div>
            <div class="hover:bg-zinc-300 rounded-full w-[36px] h-[36px] flex justify-center items-center cursor-pointer">
              <i class="pi pi-ellipsis-h text-xl text-[#65676B]" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full overflow-hidden px-2">
          <router-link :to="{ name: 'user', params: { id: i.id } }" v-for="i of friends" :key="i.id" class="flex flex-row justify-start items-center my-1 space-x-4 hover:bg-zinc-200 p-2 rounded-xl">
            <div  class="relative w-10 h-10 cursor-pointer">
              <img :src="i.photoURL" :alt="i.displayName" class="avatar" />
              <span
                class="bottom-0 left-7 absolute w-3 h-3 bg-green-400 border-2 border-white dark:border-white rounded-full"></span>
            </div>
            <span class="text-[#050505] text-sm font-medium truncate">{{ i.displayName }}</span>
          </router-link>
        </div>
        <Divider />
      </div>
      <div class="w-full flex flex-col items-start justify-start">
        <div class="w-full flex flex-row justify-between pr-2">
          <h3 class="p-2">
            <span class="text-[#65676B] font-medium">Lời mời kết bạn</span>
          </h3>
          <router-link :to="{ name: 'friends' }"
            class="flex flex-row justify-between items-center -mr-4 rounded-md hover:bg-zinc-200 px-2">
            <span class="text-sm text-mb-blue px-2">Xem thêm</span>
          </router-link>          
        </div>
        <div class="flex flex-col w-full overflow-hidden my-2 px-2">
          <div v-for="i of receives.slice().reverse().slice(1)" :key="i.id" class="flex flex-row items-center my-1 w-full space-x-2">
            <router-link :to="{ name: 'user', params: { id: i.id } }" class="relative w-14 h-14 cursor-pointer mr-2">
              <Avatar :image="i.photoURL" :pt="{ root: 'w-16 h-16', image: 'rounded-full w-full h-full' }" />
            </router-link>
            <div class="flex flex-col w-full space-y-2">
              <span class="text-[#050505] text-md font-medium truncate">{{ i.displayName }}</span>
              <div class="flex flex-row justify-between items-center w-full space-x-2">
                <Button aria-label="Chấp nhận" class="space-x-2 w-1/2 justify-center" size="small" :loading="loading.accept" @click="() => acceptRequest(i.id)">
                  <i v-if="loading.accept" class="pi pi-spin pi-spinner"></i>
                  <img v-else src="/icons/friend/add-friend.png" class=" invert w-4 h-4" />
                  <span class="font-medium text-[13px]">Chấp nhận</span>
                </Button>
                <Button aria-label="Từ chối" class="space-x-2 w-1/2 justify-center" size="small" severity="secondary" :loading="loading.reject" @click="() => rejectRequest(i.id)">
                  <i v-if="loading.reject" class="pi pi-spin pi-spinner"></i>
                  <img v-else src="/icons/friend/cancel-add-friend.png" class=" invert w-4 h-4" />
                  <span class="font-medium text-[13px] text-center">Từ chối</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>