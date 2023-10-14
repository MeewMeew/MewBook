<script setup lang="ts">
import { onUpdated, type PropType, ref } from 'vue'

import Like from '@/components/Icons/Messenger/Like.vue'
import PickEmoji from '@/components/Icons/Messenger/PickEmoji.vue'
import PickGif from '@/components/Icons/Messenger/PickGif.vue'
import PickImage from '@/components/Icons/Messenger/PickImage.vue'
import PickMore from '@/components/Icons/Messenger/PickMore.vue'
import PickSticker from '@/components/Icons/Messenger/PickSticker.vue'
import Send from '@/components/Icons/Send.vue'
import { Logger } from '@/helpers/logger'
import type { Conversation } from '@/types/messenger'

const props = defineProps({
  conversation: {
    type: Object as PropType<Conversation>,
    required: true
  }
})

const emit = defineEmits(['send-message', 'send-like'])

const message = ref<string>('')
const isTyping = ref<boolean>(false)

onUpdated(() => {
  if (message.value.length > 0) {
    isTyping.value = true
  } else {
    isTyping.value = false
  }
})

async function sendMessage() {
  if (message.value.length > 0) {
    Logger.info('Send message', message.value)
    emit('send-message', message.value)
    message.value = ''
  }
}

async function sendLike() {
  Logger.info('Send like')
  emit('send-like')
}
</script>
<template>
  <form class="flex flex-row justify-between items-center w-full" @submit.prevent="sendMessage">
    <div class="flex flex-row justify-center items-center space-x-1.5">
      <div
        class="flex justify-center items-center hover:bg-zinc-100 rounded-full p-1 cursor-pointer"
      >
        <PickMore :fill="props.conversation.theme" size="20" />
      </div>
      <transition
        enter-active-class="transition-all ease-out duration-100"
        leave-active-class="transition-all ease-out duration-100"
        enter-from-class="opacity-0 transform translate-x-5"
        leave-to-class="opacity-0 transform translate-x-5"
      >
        <div class="flex flex-row justify-center items-center space-x-1.5" v-if="!isTyping">
          <div
            class="flex justify-center items-center hover:bg-zinc-100 rounded-full p-1 cursor-pointer"
          >
            <PickImage :fill="props.conversation.theme" size="20" />
          </div>
          <div
            class="flex justify-center items-center hover:bg-zinc-100 rounded-full p-1 cursor-pointer"
          >
            <PickSticker :fill="props.conversation.theme" size="20" />
          </div>
          <div
            class="flex justify-center items-center hover:bg-zinc-100 rounded-full p-1 cursor-pointer"
          >
            <PickGif :fill="props.conversation.theme" size="20" />
          </div>
        </div>
      </transition>
    </div>
    <div class="w-full px-3">
      <div class="flex grow min-w-[0px] box-border bg-[#F0F2F5] rounded-t-3xl rounded-b-3xl">
        <div class="flex justify-end flex-wrap w-full">
          <div class="flex relative grow my-2 mx-3 w-full justify-start items-center space-x-2">
            <input
              type="text"
              class="select-text overflow-y-auto text-inherit grow outline-none text-mb-gray-2 min-h-[20px] max-h-[124px] block bg-transparent"
              v-model="message"
            />
            <PickEmoji :fill="props.conversation.theme" size="20" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-center items-center space-x-3">
      <div
        class="flex justify-center items-center hover:bg-zinc-100 rounded-full p-2 cursor-pointer"
      >
        <Send
          :fill="props.conversation.theme"
          size="20"
          v-if="isTyping"
          as="button"
          @click="sendMessage"
        />
        <Like :fill="props.conversation.theme" size="20" v-else as="button" @click="sendLike" />
      </div>
    </div>
  </form>
</template>
