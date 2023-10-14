<script setup lang="ts">
import 'vue3-colorpicker/style.css'

import { find, sortBy } from 'lodash'
import { storeToRefs } from 'pinia'
import Avatar from 'primevue/avatar'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import Call from '@/components/Icons/Messenger/Call.vue'
import CallVideo from '@/components/Icons/Messenger/CallVideo.vue'
import Info from '@/components/Icons/Messenger/Info.vue'
import ChatInput from '@/components/Messenger/ChatInput.vue'
import MessagesView from '@/components/Messenger/MessagesView.vue'
import RightSidebar from '@/components/Messenger/RightSidebar.vue'
import { Messenger } from '@/database'
import { Logger } from '@/helpers/logger'
import { mewSocket } from '@/helpers/socket'
import ConversationLayout from '@/layouts/ConversationLayout.vue'
import { useConversation } from '@/stores/conversation'
import { useUser } from '@/stores/user'
import type { Conversation, HexType, InComingMessage } from '@/types/messenger'
import { MessengerEvent } from '@/types/socket'

const router = useRouter()
const { cuser } = storeToRefs(useUser())
const { conversations } = storeToRefs(useConversation())
const id = router.currentRoute.value.params.id! as unknown as string

const conversation = ref<Conversation | null>(null)

const lastMessage = ref<InComingMessage | null>(null)

const isSidebarOpen = ref<boolean>(false)

onMounted(async () => {
  conversation.value = conversations.value.filter((c) => c.info!.id === parseInt(id))[0]

  if (!conversation.value) {
    const _conversation = await Messenger.get(cuser.value!.id)
    const _find = find(_conversation, (c) => c.participants.includes(parseInt(id)))
    if (_find) {
      conversation.value = await Messenger.fill(_find, cuser.value!.id)
    }
  }

  mewSocket.on(MessengerEvent.BOARDCAST, (id, message: InComingMessage) => {
    if (id === conversation.value!.id) {
      // get hext color from message using regex
      const hex = message.content.match(/#([a-fA-F0-9]{6})/g)
      Logger.info('hex', hex)
      if (hex) {
        conversation.value!.theme = hex[0] as HexType
      }
    }
  })
})

function updateThemeColor(color: HexType) {
  const buildMessage = Messenger.build({
    sid: cuser.value!.id,
    cid: conversation.value!.id,
    content: 'Đã thay đổi màu sắc cuộc trò chuyện thành ' + color,
    type: 'boardcast'
  })
  mewSocket.emit(MessengerEvent.SEND_MESSAGE, buildMessage, (error) => {
    if (error) {
      Logger.error(error)
    } else {
      Logger.info('Message sent')
      lastMessage.value = buildMessage
      conversations.value
        .find((c) => c.id === conversation.value!.id)!
        .messages.unshift(buildMessage)
      conversations.value = sortBy(conversations.value, (c) => c.messages[0]?.timestamp).reverse()
    }
  })
  conversation.value!.theme = color
}

function updateLastMessage(mid: string) {
  if (lastMessage.value?.id === mid) {
    lastMessage.value = null
  }
}

function sendMessage(message: string) {
  const builtMessage = Messenger.build({
    sid: cuser.value!.id,
    cid: conversation.value!.id,
    content: message,
    type: 'text'
  })
  mewSocket.emit(MessengerEvent.SEND_MESSAGE, builtMessage, (error) => {
    if (error) {
      Logger.error(error)
    } else {
      Logger.info('Message sent')
      lastMessage.value = builtMessage
      conversations.value
        .find((c) => c.id === conversation.value!.id)!
        .messages.unshift(builtMessage)
      conversations.value = sortBy(conversations.value, (c) => c.messages[0]?.timestamp).reverse()
    }
  })
}

function sendLike() {
  const buildMessage = Messenger.build({
    sid: cuser.value!.id,
    cid: conversation.value!.id,
    content: 'like',
    type: 'emoji'
  })
  mewSocket.emit(MessengerEvent.SEND_MESSAGE, buildMessage, (error) => {
    if (error) {
      Logger.error(error)
    } else {
      Logger.info('Message sent')
      lastMessage.value = buildMessage
      conversations.value
        .find((c) => c.id === conversation.value!.id)!
        .messages.unshift(buildMessage)
      conversations.value = sortBy(conversations.value, (c) => c.messages[0]?.timestamp).reverse()
    }
  })
}
</script>
<template>
  <ConversationLayout :showSidebar="isSidebarOpen" v-if="conversation">
    <template #header>
      <div class="flex flex-row space-x-3 items-center">
        <Avatar
          :image="conversation.info?.avatar"
          :pt="{ root: 'w-12 h-12', image: 'rounded-full w-full h-full border' }"
        />
        <div class="flex flex-col justify-center">
          <span class="text-md font-medium">{{ conversation.info?.name }}</span>
          <span class="text-sm text-mb-gray-2">Đang hoạt động</span>
        </div>
      </div>
      <div class="flex flex-row justify-center items-center space-x-3">
        <div
          class="flex justify-center items-center hover:bg-zinc-100 rounded-full p-2 cursor-pointer"
        >
          <Call :fill="conversation.theme" size="20" />
        </div>
        <div
          class="flex justify-center items-center hover:bg-zinc-100 rounded-full p-2 cursor-pointer"
        >
          <CallVideo :fill="conversation.theme" size="20" />
        </div>
        <div
          class="flex justify-center items-center hover:bg-zinc-100 rounded-full p-2 cursor-pointer"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <Info :fill="conversation.theme" size="22" />
        </div>
      </div>
    </template>
    <template #messages>
      <MessagesView
        :uid="+id"
        :conversation="conversation"
        :last-message="lastMessage!"
        @used:last-message="updateLastMessage"
      />
    </template>
    <template #input>
      <ChatInput :conversation="conversation" @send-message="sendMessage" @send-like="sendLike" />
    </template>
    <template #sidebar>
      <RightSidebar :conversation="conversation" @update-theme-color="updateThemeColor" />
    </template>
  </ConversationLayout>
</template>
