<script setup lang="ts">
import { useTitle, useWindowFocus } from '@vueuse/core'
//@ts-ignore
import { useSound } from '@vueuse/sound'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import Skeleton from 'primevue/skeleton'
import InfiniteLoading from 'v3-infinite-loading'
import { onMounted, onUpdated, type PropType, ref, toRefs } from 'vue'

import Like from '@/components/Icons/Messenger/Like.vue'
import { Messenger } from '@/database'
import { Logger } from '@/helpers/logger'
import { mewSocket } from '@/helpers/socket'
import { useUser } from '@/stores/user'
import type { InfiniteState } from '@/types'
import type { Conversation, InComingMessage } from '@/types/messenger'
import { MessengerEvent } from '@/types/socket'

const emit = defineEmits(['used:lastMessage'])

const props = defineProps({
  uid: {
    type: Number,
    required: true
  },
  conversation: {
    type: Object as PropType<Conversation>,
    required: true
  },
  lastMessage: {
    type: Object as PropType<InComingMessage>,
    required: false
  }
})

const { lastMessage, conversation } = toRefs(props)

const limit = 20
const { cuser } = storeToRefs(useUser())
const messages = ref<InComingMessage[]>([])
const isWindowFocused = useWindowFocus()
const title = useTitle()
const { play } = useSound('/sounds/noti.mp3')

async function loadMessages(state: InfiniteState) {
  try {
    const _limit = limit + messages.value.length
    const __messages = await Messenger.getMessages(props.conversation.id, _limit)

    if (__messages.length < _limit) {
      state.complete()
    } else {
      state.loaded()
    }

    messages.value = _.uniqBy([...__messages, ...messages.value], 'id')
  } catch (error) {
    Logger.error(error)
    state.error()
  }
}

onUpdated(() => {
  if (lastMessage?.value) {
    messages.value = [lastMessage.value, ...messages.value]
    emit('used:lastMessage', lastMessage.value.id)
  }

  if (!isWindowFocused.value) {
    if (messages.value.length > 0) {
      title.value = 'Bạn có tin nhắn mới'
    }
  } else {
    title.value = 'Messenger'
  }
})

onMounted(() => {
  mewSocket.on(MessengerEvent.RECEIVE_MESSAGE, (message: InComingMessage) => {
    play()
    if (message.cid === conversation.value!.id) {
      messages.value = [message, ...messages.value]
    }
  })

  mewSocket.on(MessengerEvent.BOARDCAST, (id, message: InComingMessage) => {
    play()
    if (id === conversation.value!.id) {
      messages.value = [message, ...messages.value]
    }
  })

  window.addEventListener('focus', () => {
    title.value = 'Messenger'
  })
})
</script>
<template>
  <div
    v-for="m in messages"
    :key="m.id"
    :id="`message-${m.id}`"
    :class="[m.sid === cuser!.id ? `self-end` : 'self-start', m.type === 'boardcast' ? 'w-full' : '']"
    class="rounded-[1em]"
  >
    <div v-if="m.type === 'boardcast'" class="w-full flex justify-center items-center">
      <p class="text-center text-sm text-gray-500">{{ m.content }}</p>
    </div>
    <div
      class="rounded-[1em] px-3 py-1 m-1 md:max-w-[600px]"
      :style="{ backgroundColor: (m.sid === cuser!.id && m.type === 'text') ? conversation.theme : '#e4e6eb' }"
      :class="[m.sid === cuser!.id ? 'text-white' : 'text-gray-800']"
      v-else-if="m.type === 'text'"
    >
      <p class="break-words" v-if="m.type === 'text'">{{ m.content }}</p>
    </div>
    <div class="flex flex-row items-center" v-else-if="m.type === 'emoji'">
      <Like :fill="conversation.theme" size="30" v-if="m.content === 'like'" />
    </div>
  </div>
  <InfiniteLoading @infinite="loadMessages" top>
    <template #spinner>
      <div class="flex flex-row">
        <Skeleton shape="circle" size="1rem" class="mx-1"></Skeleton>
        <Skeleton shape="circle" size="1rem" class="mx-1"></Skeleton>
        <Skeleton shape="circle" size="1rem" class="mx-1"></Skeleton>
      </div>
    </template>
    <template #complete>
      <div></div>
    </template>
    <template #error>
      <div></div>
    </template>
  </InfiniteLoading>
</template>
