<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

import PostVue from '@/components/Post/Post.vue'
import { Attachment, Post } from '@/database'
import MainNavLayout from '@/layouts/MainNavLayout.vue'
import { usePost } from '@/stores/post'
import type { IPost } from '@/types/index'
const router = useRouter()

const post = ref<IPost>()
const postId = +router.currentRoute.value.params.id
const { posts } = storeToRefs(usePost())

onMounted(async () => {
  const postDb = await Post.get({ id: postId })
  if (postDb) {
    if (Attachment.isID(postDb.attachment as string)) {
      const attachment = await Attachment.get(postDb.attachment as string)
      postDb.attachment = attachment.attachments
    }
    post.value = postDb
  }
  else return router.push({ name: 'dashboard' })
})

const deletePost = async (id: string) => {
  posts.value = posts.value.filter((p) => p.pid !== id)
  await Post.delete(id)
  toast.success('Đã xoá bài viết thành công.')
  router.push({ name: 'dashboard' })
}

</script>

<template>
  <MainNavLayout select="none" v-if="post">
    <div class="w-full min-h-screen bg-[#F1F2F5] flex justify-center min-w-[450px]">
      <PostVue :post="post" class="xl:w-3/5 max-w-2xl min-w-sm" :scrollable="false" :display-comment-box="true"
        @delete-post="deletePost" />
    </div>
  </MainNavLayout>
</template>