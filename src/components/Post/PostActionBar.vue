<script setup lang="ts">
import {capitalize} from 'lodash';
import { storeToRefs } from 'pinia';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';
import { computed, onMounted, ref } from 'vue';

import { Reaction } from '@/database';
import { mewSocket } from '@/helpers/socket';
import { REACTIONS } from '@/shared/constants';
import { useComment } from '@/stores/comment';
import { useUser } from '@/stores/user';
import { type INotification, type IReaction, NotificationType, ReactionType, SEvent } from '@/types/index';

const props = defineProps({
  pid: {
    type: Number,
    required: true
  },
  aid: {
    type: Number,
    required: true
  }
})

defineEmits(['toggle-comment'])

const { commentSync } = storeToRefs(useComment())
const { cuser } = storeToRefs(useUser())
const reactions = ref<IReaction[]>([])
const creaction = ref<ReactionType | null>(null)
const showReaction = ref<boolean>(false)
const topReactions = ref<ReactionType[]>([])
const commennts = computed(() => commentSync.value[props.pid.toString()] || 0)

onMounted(async () => {
  reactions.value = await Reaction.getByPost(props.pid)
  topReactions.value = Reaction.top(reactions.value)
  creaction.value = reactions.value.find(r => r.uid === cuser.value?.id)?.type || null

  mewSocket.on(SEvent.NOTIFICATION_UPDATE, async (_nid: string, data: any, type: NotificationType) => {
    if (type === NotificationType.POST_REACTION) {
      const index = reactions.value.findIndex(r => r.id === data.id)
      if (index === -1) return
      reactions.value[index].type = data.type
      topReactions.value = Reaction.top(reactions.value)
    }
  })

  mewSocket.on(SEvent.NOTIFICATION_REMOVE, async (_nid: string, data: any, type: NotificationType) => {
    if (type === NotificationType.POST_REACTION) {
      const index = reactions.value.findIndex(r => r.id === data.id)
      if (index === -1) return
      reactions.value.splice(index, 1)
      topReactions.value = Reaction.top(reactions.value)
    }
  })

  mewSocket.on(SEvent.NOTIFICATION_CREATE, async (data: INotification) => {
    if (data.type === NotificationType.POST_REACTION) {
      reactions.value.push(data.data)
    }
  })
})

const updateReaction = async (type: ReactionType, _default = false) => {
  const data = await Reaction.update({
    pid: props.pid,
    aid: props.aid,
    type: type,
    reactions: reactions.value,
    user: cuser.value!,
    default: _default
  })
  if (data) {
    reactions.value = data.reactions
    topReactions.value = data.top
    creaction.value = reactions.value.find(r => r.uid === cuser.value?.id)?.type || null
  }
}

const getReaction = (name: ReactionType) => {
  const find = REACTIONS.find(r => r.name === name)
  return find
}
</script>

<template>
  <div class="flex flex-col pt-4">
    <div class="px-5">
      <div class="flex items-center justify-between pb-3 border-b">
        <div class="">
          <div class="flex flex-row space-x-1 justify-center items-center" v-if="reactions.length > 0">
            <AvatarGroup>
              <Avatar v-for="(name, index) in topReactions" :key="index" :image="getReaction(name)?.icon" shape="circle"
                :pt="{
                  image: 'w-5 h-5 ',
                  root: 'flex items-center justify-center bg-white rounded-full text-base h-6 w-6 -ml-1 border-2 border-white'
                }" />
            </AvatarGroup>
            <span class=" text-gray-600 text-sm">{{ reactions.length }}</span>
          </div>
        </div>
        <div class="text-sm text-gray-600 font-extralight">{{ commennts }} comments</div>
      </div>
    </div>
    <div class="px-5">
      <div
        class="grid grid-cols-3 w-full border-b select-none cursor-pointer font-medium animate__animated animate__fadeIn transition-all">
        <div
          class="px-auto py-2 flex items-center justify-center text-zinc-500 space-x-2 hover:bg-zinc-200 m-1 rounded-md relative duration-300"
          @mouseenter="showReaction = true" @mouseleave="showReaction = false">
          <div class="absolute bottom-[calc(100%+10px)] z-[1] flex gap-1.5 rounded-full p-[6px] shadow w-[250px]"
            v-show="showReaction">
            <div v-for="(reaction, index) in REACTIONS" :key="index" @click="updateReaction(reaction.name)"
              class="after:bg-primary relative after:absolute after:left-[calc(50%+20px)] after:top-full after:h-4 after:w-10 after:-translate-x-1/2 after:rounded-full">
              <img :src="reaction.gif"
                class="`h-10 w-10 origin-bottom cursor-pointer transition duration-300 hover:scale-[115%]" />
            </div>
          </div>
          <div class="space-x-2 flex flex-row items-center justify-center" @click="updateReaction(ReactionType.LIKE, true)">
            <img :src="getReaction(creaction)?.icon" class="w-[19px] h-[19px]" v-if="creaction" />
            <i v-else class="pi pi-thumbs-up w-[20px] h-[20px]" />
            <span class="text-sm" v-if="creaction" :style="{color: getReaction(creaction)?.color}">
              {{ capitalize(getReaction(creaction)?.name) }}
            </span>
            <span class="text-sm" v-else>Thích</span>
          </div>
        </div>
        <div @click="$emit('toggle-comment')"
          class="px-auto py-2 flex items-center justify-center text-zinc-500 space-x-2 hover:bg-zinc-200 m-1 rounded-md duration-300">
          <i class="pi pi-comment" /> <span class="text-sm">Bình luận</span>
        </div>
        <div
          class="px-auto py-2 flex items-center justify-center text-zinc-500 space-x-2 hover:bg-zinc-200 m-1 rounded-md duration-300">
          <i class="pi pi-share-alt" /> <span class="text-sm">Chia sẻ</span>
        </div>
      </div>
    </div>
  </div>
</template>