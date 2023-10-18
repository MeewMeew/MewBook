<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Image from 'primevue/image'
import { computed, type PropType, ref } from 'vue'
import { toast } from 'vue3-toastify'

import { Attachment, Post } from '@/database'
import { usePost } from '@/stores/post'
import { useUser } from '@/stores/user'
import type { IUser } from '@/types'
const props = defineProps({
  cover: {
    type: String as PropType<IUser['coverURL']>,
    required: true
  },
  uid: {
    type: Number as PropType<IUser['id']>,
    required: true
  }
})

const { cuser } = storeToRefs(useUser())
const { posts } = storeToRefs(usePost())

const loading = ref<boolean>(false)
const upload = ref<HTMLInputElement>()
const imageView = ref<string | null>()
const imageUpload = ref<File | null>()
const imageComputed = computed(() => {
  if (imageUpload.value) {
    console.log('has image upload')
    return URL.createObjectURL(imageUpload.value)
  }
  if (props.cover) {
    console.log('has cover')
    return props.cover
  }
  console.log('use default')
  return Attachment.defaultCover
})

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

const getUploadedImage = (e: HTMLInputEvent) => {
  const file = e.target.files![0]
  imageUpload.value = file
  const fileReader = new FileReader()
  fileReader.readAsDataURL(file)
  fileReader.onload = () => {
    imageView.value = fileReader.result as string
  }
}

const createPost = async () => {
  loading.value = true

  try {
    const post = await Post.create({
      uid: cuser.value!.id,
      content: '',
      gender: cuser.value!.gender,
      attachment: imageUpload.value!,
      isCoverPhoto: true
    })

    if (Attachment.isID(post.attachment as string)) {
      const attachment = await Attachment.get(post.attachment as string)
      const large = await Attachment.cacheImage(attachment.attachments.large)
      cuser.value!.coverURL = large
      post.attachment = attachment.attachments
    }

    posts.value?.unshift(post)

    toast.success('Cập nhật ảnh bìa thành công')
  } catch (error: any) {
    console.log(error)
    toast.error('Đã có lỗi xảy ra, không thể cập nhật ảnh bìa')
  } finally {
    loading.value = false

    imageUpload.value = null
  }
}
</script>
<template>
  <div class="relative">
    <Image
      aria-placeholder="Ảnh bìa"
      loading="lazy"
      :src="imageComputed"
      preview
      :pt="{
        root: {
          class: 'w-full'
        },
        image: {
          class: 'rounded-b-xl object-cover h-96 w-full'
        },
        button: {
          class: [
            'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ',
            'bg-transparent text-gray-100',
            'hover:opacity-20 hover:cursor-pointer hover:bg-white hover:bg-opacity-50'
          ],
          icon: {
            class: 'hidden opacity-0'
          }
        }
      }"
    />

    <div
      class="absolute right-5 bottom-0 -translate-y-1/2 flex flex-col"
      v-if="cuser?.id === props.uid"
    >
      <button
        class="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 hover:bg-opacity-20 rounded-lg"
        @click="upload?.click"
        :disabled="loading"
      >
        <i class="pi pi-camera text-2xl text-white after:mix-blend-difference" />
        <span class="text-white after:mix-blend-difference" v-if="!imageUpload"
          >Chỉnh sửa ảnh bìa</span
        >
        <span class="text-white after:mix-blend-difference" v-else>Chọn ảnh bài khác</span>
      </button>
      <button
        v-if="imageUpload"
        class="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 hover:bg-opacity-20 rounded-lg"
        @click="createPost"
        :disabled="loading"
      >
        <i
          v-if="loading"
          class="pi pi-spin pi-spinner text-2xl text-white after:mix-blend-difference"
        />
        <i v-else class="pi pi-upload text-2xl text-white after:mix-blend-difference" />
        <span class="text-white after:mix-blend-difference">Cập nhật ảnh bìa</span>
      </button>

      <input
        type="file"
        accept="image/*"
        ref="upload"
        class="hidden"
        @input="getUploadedImage($event as HTMLInputEvent)"
      />
    </div>
  </div>
</template>
