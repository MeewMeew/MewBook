<script setup lang="ts">
import 'vue-advanced-cropper/dist/style.css'

import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { CircleStencil, Cropper } from 'vue-advanced-cropper'
import Close from 'vue-material-design-icons/Close.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
import { toast } from 'vue3-toastify'

import { Attachment, Post } from '@/database'
import { usePost } from '@/stores/post'
import { useUser } from '@/stores/user'

const { cuser } = storeToRefs(useUser())
const { posts } = storeToRefs(usePost())

const emit = defineEmits(['showModal'])

let cropper = ref()
let uploadedImage = ref()
let imageCropped = ref()
let loading = ref(false)
const error = ref()

const onUpload = () => {
  error.value = null
  loading.value = false
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

const getUploadedImage = (e: HTMLInputEvent) => {
  const file = e.target.files![0]
  uploadedImage.value = URL.createObjectURL(file)
  error.value = null
}
const crop = async () => {
  loading.value = true
  const { canvas } = cropper.value.getResult()
  imageCropped.value = canvas.toDataURL()

  try {
    const post = await Post.create({
      uid: cuser.value!.id,
      content: '',
      attachment: Attachment.blob(imageCropped.value),
      isProfilePhoto: true,
      gender: cuser.value!.gender
    })

    if (Attachment.isID(post.attachment as string)) {
      const attachment = await Attachment.get(post.attachment as string)
      cuser.value!.photoURL = await Attachment.image(attachment.attachments.large)
      post.attachment = attachment.attachments
    }

    posts.value?.unshift(post)
    toast.success('Cập nhật ảnh đại diện thành công')
    emit('showModal', false)
  } catch (err) {
    console.error(err)
    error.value = err
    toast.error('Đã có lỗi xảy ra, không thể cập nhật ảnh đại diện')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed z-50">
    <div class="fixed inset-0 bg-white bg-opacity-60"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex flex-col min-h-full justify-center items-center py-2">
        <div
          class="transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all max-w-xl"
        >
          <div class="flex items-center py-4 border-b border-b-gray-300">
            <div class="text-[22px] font-semibold w-full text-center">Cập nhật ảnh đại diện</div>
            <div
              @click="$emit('showModal', false)"
              class="absolute right-3 rounded-full p-1.5 bg-gray-200 hover:bg-gray-300 cursor-pointer"
            >
              <Close :size="28" fillColor="#5E6771" />
            </div>
          </div>

          <div class="flex items-center bg-white px-4 pb-4">
            <div>
              <div class="my-4">
                <label
                  for="image"
                  class="flex items-center justify-center bg-[#E7F3FF] hover:bg-[#DBE7F2] p-2 rounded-lg text-[#1977F2] w-full cursor-pointer"
                >
                  <Plus :size="20" />
                  <span class="font-medium text-md">Tải lên hình ảnh</span>
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  class="hidden"
                  @input="getUploadedImage($event as HTMLInputEvent)"
                  @click="onUpload"
                />
              </div>

              <div class="w-[350px] mx-auto">
                <Cropper
                  class="object-cover"
                  ref="cropper"
                  :stencil-component="CircleStencil"
                  :src="uploadedImage"
                />
              </div>

              <div v-show="error">
                <div class="w-full bg-red-100 text-red-700 rounded-lg mt-3 text-center">
                  <div class="p-0.5">
                    {{ error }}
                  </div>
                </div>
              </div>
              <div class="flex gap-4" :class="uploadedImage ? 'pt-4' : ''">
                <button
                  v-if="uploadedImage"
                  @click="crop"
                  type="button"
                  :disabled="loading || error"
                  class="w-full rounded-md py-2 text-white font-bold shadow-sm focus:outline-none focus:ring-0 hover:bg-blue-600 bg-blue-500 disabled:bg-zinc-300 disabled:cursor-not-allowed disabled:hover:bg-zinc-400 disabled:text-[#050505]"
                >
                  <i v-if="loading" class="pi pi-spin pi-spinner text-2xl text-white" />
                  <span v-else>Cập nhật</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
