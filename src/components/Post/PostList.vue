<script lang="ts" setup>
import { toRefs } from '@vueuse/core';
import { uniqBy } from 'lodash'
import { storeToRefs } from 'pinia';
import Skeleton from 'primevue/skeleton';
import InfiniteLoading from "v3-infinite-loading";
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify';

import PostVue from '@/components/Post/Post.vue'
import { Friend, Post } from '@/database'
import { usePost } from '@/stores/post';
import { useUser } from '@/stores/user';
import { Privacy } from '@/types';

const props = defineProps({
  uid: {
    type: Number,
    required: false
  },
  avatar: {
    type: String,
    required: false
  },
})

const limitNum = 5
const { avatar } = toRefs(props)
const { cuser } = storeToRefs(useUser())
const { posts } = storeToRefs(usePost())
const lastDoc = ref<number>(0)
const privacyMode = ref<any[]>([Privacy.PUBLIC])

onMounted(() => {
  lastDoc.value = 0
  posts.value = []
})

const load = async ($state: any) => {
  try {
    if (props.uid) {
      if (props.uid === cuser.value!.id) {
        privacyMode.value = [Privacy.PUBLIC, Privacy.FRIENDS, Privacy.PRIVATE]
      } else {
        const isFriend = await Friend.isFriend(cuser.value!.id, props.uid)
        if (isFriend) {
          privacyMode.value = [Privacy.PUBLIC, Privacy.FRIENDS]
        }
      }
    }

    const data = await Post.getAll({
      uid: props.uid,
      limit: limitNum + lastDoc.value,
      sort: 'created_at',
      order: 'desc',
      privacyMode: privacyMode.value,
    })

    posts.value = uniqBy([...data], 'pid')

    if (((data.length <= lastDoc.value) && lastDoc.value !== 0) || data.length === 0) {
      $state.complete()
    } else {
      $state.loaded()
    }
    lastDoc.value = posts.value.length
  } catch (error) {
    console.log(error)
    $state!.error()
  }
}


const deletePost = async (id: string) => {
  posts.value = posts.value.filter((p) => p.pid !== id)
  await Post.delete(id)
  toast.success('Đã xoá bài viết thành công.')
}

</script>

<template>
  <div class="w-full">
    <PostVue v-for="post in posts" :key="post.id" :post="post" :avatar="avatar" @delete-post="deletePost" :open="true"/>
    <InfiniteLoading @infinite="load">
      <template #spinner>
        <div class="border-round border-1 surface-border p-4 surface-card">
          <div class="flex mb-3">
            <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
            <div>
              <Skeleton width="10rem" class="mb-2"></Skeleton>
              <Skeleton width="5rem" class="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
            </div>
          </div>
          <Skeleton width="100%" height="150px"></Skeleton>
          <div class="flex justify-content-between mt-3">
            <Skeleton width="4rem" height="2rem"></Skeleton>
            <Skeleton width="4rem" height="2rem"></Skeleton>
          </div>
        </div>
      </template>
      <template #complete>
        <div class="flex justify-center items-center">
        </div>
      </template>
      <template #error>
        <div></div>
      </template>
    </InfiniteLoading>
  </div>
</template>