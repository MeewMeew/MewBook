<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { formatTimeAgo } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { onMounted, type PropType, ref, toRefs } from 'vue'

import { Attachment } from '@/database'
import { formatContent } from '@/helpers/format'
import { defaultFormatTimeMessages } from '@/shared/constants'
import { useUser } from '@/stores/user'
import type { ICommentNUser } from '@/types'

const props = defineProps({
  comment: {
    type: Object as PropType<ICommentNUser>,
    required: true
  }
})

const emit = defineEmits(['delete-comment'])

const { cuser } = storeToRefs(useUser())
const { comment } = toRefs(props)
const profilePhoto = ref<string>(comment.value.user.photoURL)

const menuItems = ref([
  {
    name: 'Sửa bình luận',
    icon: 'pi-pencil',
    action: () => {}
  },
  {
    name: 'Xóa bình luận',
    icon: 'pi-trash',
    action: () => {
      emit('delete-comment', comment.value.id)
    }
  }
])

onMounted(async () => {
  if (Attachment.isID(comment.value.user.photoURL)) {
    const attachment = await Attachment.get(comment.value.user.photoURL)
    profilePhoto.value = await Attachment.image(attachment.attachments.large)
  }
})
</script>
<template>
  <Menu>
    <div class="flex w-full mb-1">
      <router-link :to="{ name: 'user', params: { id: comment.user.id } }" class="mr-2">
        <img class="rounded-full ml-1 min-w-[36px] max-h-[36px]" :src="profilePhoto" />
      </router-link>
      <div class="flex flex-col justify-start items-start">
        <div class="flex items-center w-full relative">
          <div
            class="flex flex-col justify-start items-start bg-[#EFF2F5] text-sm pt-1 pb-2 px-4 rounded-2xl h-auto max-w-[500px] w-6/7"
          >
            <span class="font-medium">{{ comment.user.displayName }}</span>
            <div
              class="text-left [overflow-wrap:anywhere]"
              v-html="formatContent(comment.content)"
            ></div>
          </div>
          <div class="w-fit" v-show="comment.uid === cuser?.id">
            <MenuButton class="rounded-full p-1.5 ml-2 cursor-pointer hover:bg-[#F2F2F2] w-full">
              <i class="pi pi-ellipsis-h text-[#64676B] text-lg" />
            </MenuButton>
          </div>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2"
            >
              <MenuItem v-slot="{ active }" v-for="(item, index) in menuItems" :key="index">
                <button
                  :class="[
                    active ? 'bg-gray-200' : 'bg-white',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 select-none'
                  ]"
                  @click="item.action"
                >
                  <i :class="['pi', item.icon, 'w-5 h-5 mr-2']" :style="{ fontSize: 'large' }" />
                  {{ item.name }}
                </button>
              </MenuItem>
            </MenuItems>
          </Transition>
        </div>
        <div class="flex flex-row justify-start items-center pt-1 text-xs space-x-3 ml-2">
          <span class="hover:underline underline-offset-2 cursor-pointer font-bold text-[#65676B]"
            >Thích</span
          >
          <span class="hover:underline underline-offset-2 cursor-pointer font-bold text-[#65676B]"
            >Phản hồi</span
          >
          <span class="hover:underline underline-offset-2 cursor-pointer">
            {{
              formatTimeAgo(new Date(comment.created_at), { messages: defaultFormatTimeMessages })
            }}
          </span>
        </div>
      </div>
    </div>
  </Menu>
</template>
