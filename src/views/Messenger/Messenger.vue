<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'
import { map, some, sortBy, uniqBy } from 'lodash'
import { storeToRefs } from 'pinia'
import Avatar from 'primevue/avatar'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { Friend, Messenger } from '@/database'
import { Logger } from '@/helpers/logger'
import { mewSocket } from '@/helpers/socket'
import MessengerLayout from '@/layouts/MessengerLayout.vue'
import { defaultFormatTimeMessages2 } from '@/shared/constants'
import { useConversation } from '@/stores/conversation'
import { useUser } from '@/stores/user'
import type { Conversation, InComingMessage } from '@/types/messenger'
import { MessengerEvent } from '@/types/socket'

const router = useRouter()
const id = router.currentRoute.value.params.id! as unknown as number

const { cuser } = storeToRefs(useUser())
const { conversations } = storeToRefs(useConversation())
const friends = ref<string[]>([])
const hasConversation = computed(() => conversations.value.length > 0)

onMounted(async () => {
  const _conversations = await Messenger.get(cuser.value!.id)

  const __conversations: Conversation[] = []
  const _cParticipants = map(_conversations, 'participants')
  const _friend = await Friend.getByUID(cuser.value!.id)

  if (_friend) {
    friends.value = _friend.friends
    for (const _id of _friend.friends) {
      const participants = [parseInt(_id), cuser.value!.id]
      const contains = some(
        _cParticipants,
        (arr) => arr.includes(participants[0]) && arr.includes(participants[1])
      )
      if (!contains) {
        let c = await Messenger.create(participants)
        if (c) {
          __conversations.push(await Messenger.fill(c, cuser.value!.id))
        }
      }
    }
  }

  for (const c of _conversations) {
    const __fill = await Messenger.fill(c, cuser.value!.id)
    const __messages = await Messenger.getMessages(__fill.id, 1)
    __fill.messages = __messages
    __conversations.push(__fill)
  }
  conversations.value = uniqBy(__conversations, 'id')

  mewSocket.on(MessengerEvent.RECEIVE_MESSAGE, (message: InComingMessage) => {
    const _conversation = conversations.value.filter((c) => c.id === message.cid)[0]
    if (_conversation) {
      _conversation.messages.unshift(message)
    }
    conversations.value = sortBy(conversations.value, (c) => c.messages[0]?.timestamp).reverse()
  })
})

function getLastMessageContent(message?: InComingMessage) {
  Logger.info(message)
  if (message) {
    return message.sid === cuser.value!.id ? 'Bạn: ' + message.content : message.content
  }
  return 'Các bạn hiện đã được kết nối trên Messenger'
}
</script>
<template>
  <MessengerLayout>
    <template #sidebar>
      <div class="px-4 mt-2">
        <div class="md:flex flex-row justify-between select-none px-3 hidden">
          <span class="text-2xl font-semibold">Chat</span>
          <div class="flex select-none flex-row justify-center items-center space-x-3">
            <div
              class="flex justify-center items-center bg-zinc-200 hover:bg-zinc-300 rounded-full p-2 cursor-pointer"
            >
              <i class="pi pi-ellipsis-h" :style="{ fontSize: '20px' }" />
            </div>
            <div
              class="flex justify-center items-center bg-zinc-200 hover:bg-zinc-300 rounded-full p-2 cursor-pointer"
            >
              <img src="/icons/new-chat.png" alt="Create new chat" class="w-5 h-5" />
            </div>
          </div>
        </div>
        <div
          class="flex bg-[#EFF2F5] items-center justify-start w-full rounded-full cursor-pointer py-1.5 my-2"
        >
          <i class="pi pi-search pl-3 mx-auto text-[#64676B] text-lg" />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            class="outline-none border-none h-3 bg-transparent w-full inline-block px-3 py-3"
          />
        </div>
      </div>
      <div
        class="flex flex-col mt-3 select-none transition-all h-full nice-scrollbar"
        v-if="hasConversation"
      >
        <router-link
          :to="{ name: 'conversation', params: { id: c.info!.id } }"
          v-for="(c, index) in conversations"
          :key="index"
          class="flex flex-row px-3 py-2 mx-3 hover:bg-zinc-100 space-x-3 items-center rounded-lg w-full"
        >
          <div>
            <Avatar
              :image="c.info?.avatar"
              :pt="{ root: 'w-14 h-14', image: 'rounded-full w-full h-full border' }"
            />
          </div>
          <div class="hidden md:flex flex-col max-w-2/3 w-full">
            <span class="text-md font-medium">{{ c.info?.name }}</span>
            <div class="flex flex-row justify-start items-center space-x-1 w-full">
              <div class="max-w-[160px] truncate">
                <span class="text-sm text-mb-gray-2 break-keep">{{
                  getLastMessageContent(c.messages[0])
                }}</span>
              </div>
              <div v-if="c.messages[0]" class="flex items-center space-x-1">
                <div class="relative w-2 h-2">
                  <div
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-px bg-black rounded-full"
                  ></div>
                </div>
              </div>
              <span class="text-xs text-mb-gray-2" v-if="c.messages[0]">
                {{
                  formatTimeAgo(new Date(c.messages[0]!.timestamp), {
                    messages: defaultFormatTimeMessages2
                  })
                }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </template>
    <template #view>
      <router-view v-if="id" :key="($route.params.id as string)" />
      <div v-else class="flex flex-col justify-center items-center w-full h-full">
        <img src="/icons/choose-someone.png" alt="Chọn một đoạn hội thoại để bắt đầu trò chuyện" />
        <span class="text-xl font-semibold text-mb-gray-2"
          >Chọn một đoạn hội thoại để bắt đầu trò chuyện</span
        >
      </div>
    </template>
  </MessengerLayout>
</template>
