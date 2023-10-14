<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import { type PropType, reactive, toRefs } from 'vue'
import { ColorPicker } from 'vue3-colorpicker'

import PickColor from '@/components/Icons/Messenger/PickColor.vue'
import { Messenger } from '@/database'
import { Logger } from '@/helpers/logger'
import type { Conversation } from '@/types/messenger'

const props = defineProps({
  conversation: {
    type: Object as PropType<Conversation>,
    required: true
  }
})

const { conversation } = toRefs(props)

const emit = defineEmits(['update-theme-color'])

const isOpen = reactive({
  sidebar: false,
  conversation: false,
  options: false,
  attachments: false,
  privacy: false
})

async function updateThemeColor(callback: () => void) {
  const res = await Messenger.update(conversation.value.id, { theme: conversation.value.theme })
  if (res) {
    Logger.info('Updated theme color', conversation.value.theme)
    emit('update-theme-color', conversation.value.theme)
  }
  callback()
}
</script>
<template>
  <div class="w-full h-full flex flex-col overscroll-y-auto">
    <div class="w-full items-center justify-center flex my-2">
      <Avatar
        :image="conversation.info?.avatar"
        :pt="{ root: 'w-24 h-24', image: 'rounded-full w-full h-full border' }"
      />
    </div>
    <div class="w-full flex flex-col items-center justify-center">
      <span class="text-xl font-medium">{{ conversation.info?.name }}</span>
      <span class="text-sm text-mb-gray-2">Đang hoạt động</span>
    </div>
    <div class="w-full flex flex-row items-center justify-center mt-5 px-10">
      <div class="flex flex-col justify-center items-center w-20 mx-auto">
        <div
          class="flex justify-center items-center bg-zinc-200 hover:bg-zinc-300 rounded-full p-2 cursor-pointer"
        >
          <img src="/icons/profile.png" class="w-5 h-5" />
        </div>
        <span class="text-xs text-mb-gray-2 text-center">Trang cá nhân</span>
      </div>
      <div class="flex flex-col justify-center items-center w-20 mx-auto">
        <div
          class="flex justify-center items-center bg-zinc-200 hover:bg-zinc-300 rounded-full p-2 cursor-pointer"
        >
          <img src="/icons/noti/allow-noti.png" v-if="conversation.notification" class="w-5 h-5" />
          <img src="/icons/noti/disallow-noti.png" v-else class="w-5 h-5" />
        </div>
        <span class="text-xs text-mb-gray-2 text-center" v-if="conversation.notification"
          >Tắt thông báo</span
        >
        <span class="text-xs text-mb-gray-2 text-center" v-else>Bật thông báo</span>
      </div>
      <div class="flex flex-col justify-center items-center w-20 mx-auto">
        <div
          class="flex justify-center items-center bg-zinc-200 hover:bg-zinc-300 rounded-full p-2 cursor-pointer"
        >
          <i class="pi pi-search font-medium" :style="{ fontSize: '20px' }" />
        </div>
        <span class="text-xs text-mb-gray-2 text-center">Tìm kiếm</span>
      </div>
    </div>
    <div class="w-full flex flex-col justify-center items-center select-none my-7 transition-all">
      <div
        class="w-full flex flex-row justify-between items-center px-3 py-3 rounded-lg hover:bg-zinc-100 cursor-pointer duration-100"
        @click="isOpen.conversation = !isOpen.conversation"
      >
        <span class="font-medium">Thông tin đoạn chat</span>
        <i class="pi" :class="[isOpen.conversation ? 'pi-chevron-up' : 'pi-chevron-down']" />
      </div>
      <div v-if="isOpen.conversation"></div>
      <div
        class="w-full flex flex-row justify-between items-center px-3 py-3 rounded-lg hover:bg-zinc-100 cursor-pointer duration-100"
        @click="isOpen.options = !isOpen.options"
      >
        <span class="font-medium">Tuỳ chỉnh đoạn chat</span>
        <i class="pi" :class="[isOpen.options ? 'pi-chevron-up' : 'pi-chevron-down']" />
      </div>
      <Popover v-if="isOpen.options" class="w-full flex flex-col px-1 relative">
        <PopoverButton
          class="w-full flex flex-row justify-start items-center px-3 py-3 rounded-lg hover:bg-zinc-100 cursor-pointer duration-100"
        >
          <PickColor :fill="conversation.theme" size="20" />
          <span class="font-medium ml-3">Đổi màu đoạn chat</span>
        </PopoverButton>
        <PopoverPanel class="absolute w-full h-full top-full" v-slot="{ close }">
          <div class="bg-white flex justify-center items-center flex-col">
            <ColorPicker
              is-widget
              format="hex"
              shape="square"
              disable-history
              round-history
              disable-alpha
              v-model:pureColor="conversation.theme"
            />
            <div class="flex flex-row justify-center items-center space-x-3 mt-3 w-full">
              <Button
                aria-label="Lưu"
                class="space-x-2 w-1/2 justify-center py-2"
                size="small"
                @click="updateThemeColor(close)"
              >
                <span class="font-medium text-[16px]">Lưu</span>
              </Button>
            </div>
          </div>
        </PopoverPanel>
      </Popover>
      <div
        class="w-full flex flex-row justify-between items-center px-3 py-3 rounded-lg hover:bg-zinc-100 cursor-pointer duration-100"
        @click="isOpen.attachments = !isOpen.attachments"
      >
        <span class="font-medium">File đa phương tiện</span>
        <i class="pi" :class="[isOpen.attachments ? 'pi-chevron-up' : 'pi-chevron-down']" />
      </div>
      <div v-if="isOpen.attachments">3</div>
      <div
        class="w-full flex flex-row justify-between items-center px-3 py-3 rounded-lg hover:bg-zinc-100 cursor-pointer duration-100"
        @click="isOpen.privacy = !isOpen.privacy"
      >
        <span class="font-medium">Quyền riêng tư & hỗ trợ</span>
        <i class="pi" :class="[isOpen.privacy ? 'pi-chevron-up' : 'pi-chevron-down']" />
      </div>
      <div v-if="isOpen.privacy" class="w-full flex flex-col px-1 relative">
        <div
          class="w-full flex flex-row justify-start items-center px-4 py-3 rounded-lg space-x-3 hover:bg-zinc-100 cursor-pointer duration-100"
        >
          <img src="/icons/limit.png" alt="" class="w-5 h-5" />
          <span class="font-medium">Hạn chế đoạn chat</span>
        </div>
      </div>
    </div>
  </div>
</template>
