<script setup lang="ts">
import Image from 'primevue/image'
import { onMounted, type PropType, ref } from 'vue'

import { Attachment } from '@/database'
import type { IAttachmentItem, IUser } from '@/types/index'

const photoImage = ref<string>()

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  attachment: {
    type: Object as PropType<IAttachmentItem>,
    required: true
  },
  user: {
    type: Object as PropType<IUser>,
    required: true
  },
  open: {
    type: Boolean,
    required: false
  }
})

onMounted(async () => {
  photoImage.value = await Attachment.cacheImage(props.attachment.large)
})
</script>

<template>
  <div class="w-full h-96 overflow-hidden relative select-none" v-if="user">
    <div
      class="min-w-0 flex flex-col m-0 min-h-0 items-stretch border-b border-white w-full h-48 overflow-hidden"
    >
      <div
        v-if="props.user.coverURL"
        class="absolute w-full overflow-hidden top-0 overflow-y-hidden md:h-[222px] h-full block"
      >
        <img
          :src="props.user.coverURL"
          class="inline-block w-full h-full object-cover overflow-clip text-ellipsis"
        />
      </div>
      <div
        v-if="!open"
        class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 max-w-xs"
      >
        <Image
          v-if="photoImage"
          :src="photoImage"
          preview
          :pt="{
            image: {
              class: 'rounded-full cursor-pointer border-4 border-white'
            },
            button: {
              class: [
                'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ',
                'bg-transparent text-gray-100',
                'hover:opacity-20 hover:cursor-pointer hover:bg-white hover:bg-opacity-50',
                'rounded-full'
              ]
            },
            icon: {
              class: 'hidden opacity-0'
            }
          }"
        />
      </div>

      <router-link
        v-else
        :to="{ name: 'post', params: { id: id } }"
        class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 max-w-xs"
      >
        <Image
          v-if="photoImage"
          :src="photoImage"
          :pt="{
            image: {
              class: 'rounded-full cursor-pointer border-4 border-white'
            },
            button: {
              class: [
                'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ',
                'bg-transparent text-gray-100',
                'hover:opacity-20 hover:cursor-pointer hover:bg-white hover:bg-opacity-50',
                'rounded-full'
              ]
            },
            icon: {
              class: 'hidden opacity-0'
            }
          }"
        />
      </router-link>
    </div>
  </div>
</template>
