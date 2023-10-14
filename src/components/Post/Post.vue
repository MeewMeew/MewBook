<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { formatTimeAgo } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onMounted, type PropType, ref, toRefs } from 'vue'

import PostActionBar from '@/components/Post/PostActionBar.vue'
import PostComments from '@/components/Post/PostComments.vue'
import PostContent from '@/components/Post/PostContent.vue'
import PostProfilePhoto from '@/components/Post/PostProfilePhoto.vue'
import { Attachment, User } from '@/database'
import { defaultFormatTimeMessages } from '@/shared/constants'
import { useUser } from '@/stores/user'
import { Privacy } from '@/types'
import type { IAttachmentItem, IPost, IUser } from '@/types/index'

const emit = defineEmits(['delete-post', 'hide-post'])

const props = defineProps({
  post: {
    type: Object as PropType<IPost>,
    required: true
  },
  avatar: {
    type: String,
    required: false
  },
  scrollable: {
    type: Boolean,
    required: false,
    default: true
  },
  displayCommentBox: {
    type: Boolean,
    required: false,
    default: false
  },
  open: {
    type: Boolean,
    required: false,
    default: false
  }
})

const { post, avatar, displayCommentBox, scrollable } = toRefs(props)
const { cuser } = storeToRefs(useUser())

const user = ref<IUser>()
const showComments = ref(displayCommentBox.value)
const subnameInfo = computed(() => (!post.value.isNormalPost ? post.value.content : ''))
const isCurrentUser = computed(() => cuser.value?.id === user.value?.id)
const menuItems = ref([
  {
    text: 'Xoá bài viết',
    icon: 'pi pi-fw pi-trash',
    action: () => {
      emit('delete-post', post.value.pid)
    }
  },
  {
    text: 'Quyền riêng tư',
    icon: 'pi pi-fw pi-lock',
    action: () => {
      // TODO: Change privacy
    }
  }
])

onMounted(async () => {
  const res = await User.get({ id: post.value.uid })
  if (!res) return
  if (Attachment.isID(res.photoURL)) {
    const attachment = await Attachment.get(res.photoURL)
    res.photoURL = await Attachment.image(attachment.attachments.large)
  }
  if (Attachment.isID(res.coverURL)) {
    const attachment = await Attachment.get(res.coverURL)
    res.coverURL = await Attachment.image(attachment.attachments.large)
  }
  user.value = res
})
</script>

<template>
  <Menu as="div">
    <div class="w-full h-fit bg-white rounded-lg my-4 shadow-md" v-if="user">
      <div class="flex items-center px-3">
        <router-link :to="{ name: 'user', params: { id: user.id } }" class="mr-2">
          <img class="avatar ml-1 max-w-[42px] max-h-[42px]" :src="avatar || user.photoURL" />
        </router-link>
        <div class="flex items-center justify-between p-2 rounded-full w-full">
          <div>
            <div class="font-medium text-[15px] text-[#050505] space-x-1">
              <router-link
                :to="{ name: 'user', params: { id: user.id } }"
                class="hover:underline"
                >{{ user.displayName }}</router-link
              >
              <span class="font-light">{{ subnameInfo }}</span>
            </div>
            <div class="flex items-center justify-start gap-1 text-gray-600">
              <router-link
                :to="{ name: 'post', params: { id: post.id } }"
                class="flex items-center hover:underline"
              >
                <span class="text-xs">{{
                  formatTimeAgo(new Date(post.created_at), { messages: defaultFormatTimeMessages })
                }}</span>
              </router-link>
              <img
                v-if="post.privacy === Privacy.PUBLIC"
                src="/icons/privacy/public.png"
                class="my-auto w-3 h-3"
              />
              <img
                v-else-if="post.privacy === Privacy.FRIENDS"
                src="/icons/privacy/friends.png"
                class="my-auto w-3 h-3"
              />
              <img
                v-else-if="post.privacy === Privacy.PRIVATE"
                src="/icons/privacy/private.png"
                class="my-auto w-3 h-3"
              />
            </div>
          </div>
          <div class="relative card flex justify-center" v-if="isCurrentUser">
            <MenuButton class="rounded-full p-1.5 ml-2 cursor-pointer hover:bg-[#F2F2F2] w-10 h-10">
              <i class="pi pi-ellipsis-h" />
            </MenuButton>

            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems
                class="absolute -left-40 top-5 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2 z-50"
              >
                <MenuItem v-slot="{ active }" v-for="(item, index) in menuItems" :key="index">
                  <button
                    :class="[
                      active ? 'bg-gray-200' : 'bg-white',
                      'group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 select-none space-x-4'
                    ]"
                    @click="item?.action"
                  >
                    <i :class="item.icon" class="w-5 h-5 mr-1" />
                    <span class="text-gray-700">{{ item.text }}</span>
                  </button>
                </MenuItem>
              </MenuItems>
            </Transition>
          </div>
        </div>
      </div>
      <PostProfilePhoto
        v-if="post.isProfilePhoto"
        :id="post.id"
        :open="open"
        :attachment="(post.attachment as IAttachmentItem)"
        :user="user"
      />
      <PostContent
        v-if="post.isNormalPost && post.attachment"
        :content="post.content"
        :id="post.id"
        :attachment="(post.attachment as IAttachmentItem)"
        :open="open"
      />
      <PostContent
        v-if="post.isNormalPost && !post.attachment"
        :content="post.content"
        :open="open"
        :id="post.id"
      />
      <PostContent
        v-if="post.isCoverPhoto"
        :attachment="(post.attachment as IAttachmentItem)"
        :open="open"
        :id="post.id"
      />
      <PostActionBar
        :pid="post.id"
        @toggle-comment="showComments = !showComments"
        :aid="post.uid"
      />
      <PostComments v-show="showComments" :pid="post.id" :uid="post.uid" :scrollable="scrollable" />
    </div>
  </Menu>
</template>
