<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import { Attachment } from '@/database/attachment';
import { useGeneral } from '@/stores/general'
import { useUser } from '@/stores/user';

const { cuser } = storeToRefs(useUser())
const { isPostOverlay } = storeToRefs(useGeneral())

onMounted(async() => {
  if (!cuser.value) return
  if (Attachment.isID(cuser.value.photoURL)) {
    const attachment = await Attachment.get(cuser.value.photoURL)
    cuser.value.photoURL = await Attachment.image(attachment.attachments.large)
  }
})
</script>

<template>
  <div class="w-full bg-white rounded-lg px-3 mt-4 shadow-md" v-if="cuser">
    <div class="flex items-center py-3 border-b">
      <router-link :to="{ name: 'user', params: { id: cuser.id } }" class="mr-2">
        <img class="avatar ml-1 w-[36px] h-[36px]" :src="cuser.photoURL" />
      </router-link>
      <button @click="isPostOverlay = true"
        class="flex items-center justify-start bg-[#EFF2F5] hover:bg-zinc-200 p-2 rounded-full w-full cursor-pointer">
        <div class="text-left pl-2 text-zinc-500 text-clip overflow-hidden">{{ cuser.displayName }} ơi, bạn đang nghĩ gì vậy?</div>
      </button>
    </div>

    <div class="flex items-center py-3 border-b text-sm font-medium">
      <button
        class="flex items-center justify-center p-1 hover:bg-[#F2F2F2] w-full rounded-lg mx-1 cursor-pointer space-x-2">
        <img src="/icons/live.png" width="24" height="24" />
        <div class="text-[#6F7275]">Video trực tiếp</div>
      </button>
      <button @click="isPostOverlay = true"
        class="flex items-center justify-center p-1 hover:bg-[#F2F2F2] w-full rounded-lg mx-1 cursor-pointer space-x-2">
        <img src="/icons/images.png" width="24" height="24" />
        <div class="text-[#6F7275]">Ảnh/video</div>
      </button>
      <button
        class="flex items-center justify-center p-1 hover:bg-[#F2F2F2] w-full rounded-lg mx-1 cursor-pointer space-x-2">
        <img src="/icons/emotion.png" width="24" height="24" />
        <div class="text-[#6F7275]">Cảm xúc</div>
      </button>
    </div>
  </div>
</template>
