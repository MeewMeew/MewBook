<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Image from 'primevue/image'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import CreatePostBox from '@/components/Common/CreatePostBox.vue'
import PostList from '@/components/Post/PostList.vue'
import UserHeader from '@/components/User/UserHeader.vue'
import { Attachment, Friend, Post, User } from '@/database'
import MainNavLayout from '@/layouts/MainNavLayout.vue'
import { useUser } from '@/stores/user'
import type { IAttachmentItem, IUser } from '@/types'

const { cuser } = storeToRefs(useUser())

const router = useRouter()
const userId = +router.currentRoute.value.params.id
const user = ref<IUser>()
const images = ref<{id: number, image: string}[]>([])
const is = reactive({
  friend: false,
  self: false
})

onMounted(async () => {
  if (cuser.value?.id === userId){
    user.value = cuser.value
    is.self = true
  }
  else {
    const userDb = await User.get({ id: userId })
    if (userDb) user.value = userDb
    else return router.push({ name: 'dashboard' })
    is.friend = await Friend.isFriend(cuser.value!.id, userId)
  }

  const posts = await Post.getAll({
    uid: userId,
    limit: 20,
    sort: 'created_at',
    order: 'desc',
    attachment: true
  })

  for (const post of posts) {
    if (post.attachment) {
      const medium = await Attachment.image((post.attachment as IAttachmentItem).large)
      if (images.value.length === 9) break;
      else images.value.push({ id: post.id, image: medium })
    }
  }

  watch(() => cuser.value!, (newUser) => {
    if (newUser) {
      if (newUser.id === cuser.value?.id) user.value = cuser.value
      else user.value = newUser
    }
  })
})
</script>

<template>
  <MainNavLayout select="none">
    <div class="w-full min-h-[100vh] pb-20 bg-[#F1F2F5] min-w-sm" v-if="cuser">
      <UserHeader v-if="user" :user="user" />

      <div class="flex-cols md:flex w-full max-w-[1100px] justify-between h-[calc(100%-56px)] md:px-0 px-2 mx-auto">
        <div class="w-full md:w-5/12 mt-4 mr-4">
          <div class="bg-white p-3 rounded-lg shadow-lg">
            <div class="font-bold pb-2 text-xl">Giới thiệu</div>
            <div class="pb-5">
              <button class="w-full bg-gray-200 hover:bg-gray-300 rounded-lg p-2 font-medium text-sm text-[#050505]">
                Thêm tiểu sử
              </button>
            </div>
            <div class="pb-5">
              <button class="w-full bg-gray-200 hover:bg-gray-300 rounded-lg p-2 font-medium text-sm text-[#050505]">
                Chỉnh sửa chi tiết
              </button>
            </div>
            <div class="pb-5">
              <button class="w-full bg-gray-200 hover:bg-gray-300 rounded-lg p-2 font-medium text-sm text-[#050505]">
                Chỉnh sửa sở thích
              </button>
            </div>
            <div>
              <button class="w-full bg-gray-200 hover:bg-gray-300 rounded-lg p-2 font-medium text-sm text-[#050505]">
                Thêm nội dung đáng chú ý
              </button>
            </div>
          </div>

          <div class="bg-white p-3 mt-4 rounded-lg shadow-lg sticky z-10 top-20">
            <div class="font-bold pb-2 text-xl">Ảnh</div>
            <div class="grid grid-cols-3">
              <router-link :to="{name: 'post', params: {id: i.id}}" v-for="i in images" :key="i.id" class="rounded-lg">
                <Image :src="i.image" :pt="{
                  root: 'rounded-lg relative',
                  image: {
                    class: 'cursor-pointer border-white border-4 border-white aspect-square object-cover rounded-lg cursor-pointer'
                  }
                }" />
              </router-link>
            </div>
          </div>
        </div>

        <div class="w-full md:w-7/12 overflow-y-scroll overflow-x-hidden nice-scrollbar" v-if="cuser">
          <CreatePostBox />
          <PostList scope="user" :uid="userId" :avatar="user?.photoURL" />
        </div>
      </div>
    </div>
  </MainNavLayout>
</template>