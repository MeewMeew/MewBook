<script setup lang="ts">
import emojiData from 'emoji-mart-vue-fast/data/twitter.json'
// @ts-ignore
import { EmojiIndex, Picker } from 'emoji-mart-vue-fast/src'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { omit } from 'lodash'
import { storeToRefs } from 'pinia'
import Avatar from 'primevue/avatar'
import OverlayPanel from 'primevue/overlaypanel'
import Textarea from 'primevue/textarea'
import { onMounted, ref, toRefs } from 'vue'

import Send from '@/components/Icons/Send.vue'
import PostComment from '@/components/Post/PostComment.vue'
import { Comment, User } from '@/database'
import { formatContentBreakLine } from '@/helpers/format'
import { mewSocket } from '@/helpers/socket'
import { STICKERS_URL } from '@/shared/constants'
import { db } from '@/shared/firebase'
import { useComment } from '@/stores/comment'
import { useSticker } from '@/stores/sticker'
import { useUser } from '@/stores/user'
import type { IComment, ICommentNUser, INotification, IUser } from '@/types/index'
import { NotificationType, SEvent } from '@/types/index'

const props = defineProps({
  pid: {
    type: Number,
    required: true
  },
  uid: {
    type: Number,
    required: true
  },
  scrollable: {
    type: Boolean,
    required: true
  }
})

const emojiIndex = new EmojiIndex(emojiData)

const { scrollable } = toRefs(props)

const { commentSync } = storeToRefs(useComment())
const { cuser } = storeToRefs(useUser())
const { stickers } = storeToRefs(useSticker())

const op = ref()
const comment = ref<string>('')
const comments = ref<ICommentNUser[]>([])

const selectEmoji = (emoji: any) => {
  comment.value += emoji.native
}

const toggle = (e: Event) => {
  op.value.toggle(e)
}

const createComment = async () => {
  if (!comment.value) return
  const commentify = JSON.stringify(comment.value)
  const content = formatContentBreakLine(commentify.slice(1, commentify.length - 1))
  const commentData = await Comment.create({
    uid: cuser.value?.id as number,
    pid: props.pid,
    aid: props.uid,
    content: content
  })

  mewSocket.emit(SEvent.POST_COMMENT_ADD, commentData)

  const commentDataNUser: ICommentNUser = {
    ...commentData,
    user: cuser.value as IUser
  }

  comments.value.unshift(commentDataNUser)
  commentSync.value[props.pid.toString()] = comments.value.length
  comment.value = ''
}

const deleteComment = async (id: number) => {
  const cb = (c: IComment) => c.id == id
  const comment = comments.value.find(cb)
  await Comment.delete(comment?.cid as string)
  comments.value.splice(comments.value.findIndex(cb), 1)
  mewSocket.emit(SEvent.POST_COMMENT_REMOVE, omit(comment, 'user'))
  commentSync.value[props.pid.toString()] = comments.value.length
}

onMounted(async () => {
  async function loadCurrentComments(reload = false) {
    const userRef = collection(db, 'users')
    const commentRef = collection(db, 'comments')
    const queryComment = query(
      commentRef,
      where('pid', '==', props.pid),
      orderBy('created_at', 'desc')
    )
    const querySnapComment = await getDocs(queryComment)
    querySnapComment.forEach(async (doc) => {
      const commentData = doc.data() as IComment
      const queryUser = query(userRef, where('id', '==', commentData.uid))
      const querySnapUser = await getDocs(queryUser)
      const commentDataNUser: ICommentNUser = {
        ...commentData,
        user: querySnapUser.docs[0].data() as IUser
      }
      if (comments.value.some((c) => c.id == commentData.id)) return
      if (reload) comments.value.unshift(commentDataNUser)
      else comments.value.push(commentDataNUser)
      commentSync.value[props.pid.toString()] = comments.value.length
    })
  }

  if (stickers.value.length === 0) {
    await fetch(STICKERS_URL)
      .then((res) => res.json())
      .then((data) => {
        stickers.value = data
      })
      .catch((err) => console.log(err))
  }

  mewSocket.on(SEvent.NOTIFICATION_REMOVE, async (noti: INotification) => {
    if (noti.type === NotificationType.POST_COMMENT) {
      const cb = (c: IComment) => c.id == noti.data.id
      comments.value.splice(comments.value.findIndex(cb), 1)
      commentSync.value[props.pid.toString()] = comments.value.length
    }
  })

  mewSocket.on(SEvent.NOTIFICATION_CREATE, async (data: INotification) => {
    if (data.type === NotificationType.POST_COMMENT) {
      const commentData = data.data as ICommentNUser
      const user = (await User.get({ id: commentData.uid }))!
      commentData.user = user
      if (comments.value.some((c) => c.id == commentData.id)) return
      comments.value.unshift(commentData)
      commentSync.value[props.pid.toString()] = comments.value.length
    }
  })

  await loadCurrentComments()
})
</script>

<template>
  <div class="flex flex-col">
    <div class="px-3">
      <div class="flex items-center justify-between py-2" v-if="cuser">
        <div class="flex items-center w-full">
          <router-link :to="{ name: 'user', params: { id: cuser.id } }" class="mr-2">
            <Avatar
              :image="cuser.photoURL"
              shape="circle"
              :pt="{
                root: 'w-10 h-10',
                image: 'rounded-full w-full h-full'
              }"
            />
          </router-link>
          <form
            class="flex flex-col items-center justify-center bg-[#EFF2F5] px-1 rounded-xl w-full overflow-hidden"
            @submit.prevent="createComment"
          >
            <div class="w-full">
              <Textarea
                v-model="comment"
                placeholder="Viết bình luận..."
                rows="1"
                autoResize
                :pt="{
                  root: 'w-full text-md mx-1 border-none p-0 bg-[#EFF2F5] placeholder-[#64676B] ring-0 focus:ring-0 pt-1 outline-none pl-2 h-auto resize-none rounded-lg'
                }"
                @keydown.enter.exact.prevent="createComment"
              />
            </div>
            <div class="flex flex-row justify-between items-center w-full px-3 pb-2">
              <div class="flex flex-row justify-center items-center space-x-2">
                <i
                  class="pi pi-star text-zinc-300 hover:text-zinc-400 cursor-pointer"
                  style="font-size: large"
                />
                <i
                  class="pi pi-camera text-zinc-300 hover:text-zinc-400 cursor-pointer"
                  style="font-size: large"
                />
                <i
                  class="pi pi-heart text-zinc-300 hover:text-zinc-400 cursor-pointer"
                  style="font-size: large"
                  @click="toggle"
                />
                <OverlayPanel ref="op" append-to="body">
                  <Picker
                    @select="selectEmoji"
                    :data="emojiIndex"
                    set="facebook"
                    :showPreview="false"
                    :showSearch="false"
                    :showSkinTones="false"
                  />
                </OverlayPanel>
              </div>
              <button
                type="submit"
                :disabled="!comment"
                :class="{ ['cursor-not-allowed']: !comment }"
                class="flex items-center text-sm p-1.5 rounded-full hover:bg-zinc-200 text-white font-bold"
              >
                <Send size="20" :disabled="comment === ''" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div
      v-if="comments"
      class="pb-2 px-4 overflow-y-scroll nice-scrollbar"
      :class="{ 'max-h-[300px]': scrollable }"
    >
      <div
        class="flex items-center justify-between my-2 max-w-[610px]"
        v-for="c in comments"
        :key="c.id"
      >
        <PostComment :comment="c" @delete-comment="deleteComment" />
      </div>
    </div>
  </div>
</template>
