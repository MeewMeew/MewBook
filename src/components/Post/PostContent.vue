<script setup lang="ts">
import Image from 'primevue/image'
import { onMounted, type PropType, ref } from 'vue'

import { Attachment } from '@/database'
import { formatContent } from '@/helpers/format'
import type { IAttachmentItem } from '@/types'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: false
  },
  attachment: {
    type: Object as PropType<IAttachmentItem>,
    required: false
  },
  open: {
    type: Boolean,
    required: false
  }
})

const photoImage = ref<string>()

onMounted(async () => {
  if (props.attachment) {
    photoImage.value = await Attachment.image(props.attachment!.large)
  }
})
</script>
<template>
  <div
    v-if="props.content"
    class="px-5 pb-2 text-[17px] font-medium"
    v-html="formatContent(props.content)"
  ></div>
  <div class="w-full" v-if="photoImage">
    <div
      :class="['object-fill w-full bg-no-repeat backdrop-blur-md bg-white/30']"
      :style="{ backgroundImage: `url('${photoImage}/blur')`, backgroundSize: 'cover' }"
    >
      <div class="object-cover flex items-center justify-center" v-if="!open">
        <Image
          :src="photoImage"
          preview
          :pt="{
            image: {
              class: 'cursor-pointer'
            },
            button: {
              class: [
                'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ',
                'bg-transparent text-gray-100',
                'hover:opacity-20 hover:cursor-pointer hover:bg-white hover:bg-opacity-50'
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
        :to="{ name: 'post', params: { id } }"
        class="object-cover flex items-center justify-center"
      >
        <Image
          :src="photoImage"
          :pt="{
            image: {
              class: 'cursor-pointer'
            },
            button: {
              class: [
                'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ',
                'bg-transparent text-gray-100',
                'hover:opacity-20 hover:cursor-pointer hover:bg-white hover:bg-opacity-50'
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
