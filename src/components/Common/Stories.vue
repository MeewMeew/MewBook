<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import Plus from '@/components/Icons/Plus.vue'
import { Attachment, User } from '@/database'
import { useUser } from '@/stores/user'
import type { IUser } from '@/types'

const { cuser } = storeToRefs(useUser())
const user = ref<IUser>()

onMounted(async () => {
  const userDb = await User.get({ authid: cuser.value!.authid })
  if (userDb) {
    if (Attachment.isID(userDb.photoURL)) {
      const attachment = await Attachment.get(userDb.photoURL)
      userDb.photoURL = await Attachment.cacheImage(attachment.attachments.large)
    }
    user.value = userDb
  }
})
</script>
<template>
  <div v-if="user" class="">
    <div class="flex flex-row items-center justify-start space-x-2 w-full overflow-y-hidden">
      <div class="flex w-[160px] h-[250px] rounded-xl drop-shadow-md">
        <div class="relative h-[180px]">
          <img
            :src="user.photoURL"
            class="w-[160px] h-[180px] object-cover overflow-clip text-ellipsis rounded-t-xl"
          />
          <div
            class="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-mb-blue w-10 h-10 items-center flex justify-center border-white border-4"
          >
            <Plus size="20" fill="#fff" />
          </div>
          <div
            class="flex items-center justify-center my-auto flex-grow h-[70px] bg-white rounded-b-lg"
          >
            <span class="font-medium text-md text-zinc-700 pt-2">Tạo tin mới</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
