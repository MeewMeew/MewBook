<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Image from 'primevue/image';
import type { PropType } from 'vue';
import { onMounted, ref } from 'vue';

import { Attachment, Post } from '@/database';
import { useUser } from '@/stores/user';
import type { IAttachmentItem, IUser } from '@/types';

import CreatePostBox from '../Common/CreatePostBox.vue';
import PostList from '../Post/PostList.vue';

const props = defineProps({
  user: {
    type: Object as PropType<IUser>,
    required: true
  }
})

const { cuser } = storeToRefs(useUser())
const images = ref<{ id: number, image: string }[]>([])

onMounted(async () => {
  const posts = await Post.getAll({
    uid: props.user.id,
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
})

</script>
<template>
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
        <router-link :to="{ name: 'post', params: { id: i.id } }" v-for="i in images" :key="i.id" class="rounded-lg">
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
    <CreatePostBox v-if="cuser.id === props.user.id" />
    <PostList scope="user" :uid="props.user.id" :avatar="props.user?.photoURL" />
  </div>
</template>