<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { capitalize } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'

import { Attachment, Post } from '@/database'
import OptionsOverlayLayout from '@/layouts/OptionsOverlayLayout.vue'
import { PrivacyOptions } from '@/shared/constants'
import { useGeneral } from '@/stores/general'
import { usePost } from '@/stores/post'
import { useUser } from '@/stores/user'
import { Privacy } from '@/types'

const { posts } = storeToRefs(usePost())
const { isPostOverlay } = storeToRefs(useGeneral())

const { cuser } = useUser()

const rows = ref<number>(3)
const text = ref<string>()
const textLines = ref(0)
const error = ref<any>()
const loading = ref<boolean>(false)
const textarea = ref<string>()
const imageView = ref<string | null>()
const imageUpload = ref<File | null>()
const menuItems = ref(PrivacyOptions)
const cprivacy = ref(PrivacyOptions[0])

const createPost = async () => {
  try {
    if (disabledButton.value) return
    if (!text.value) return (error.value = 'Nội dung không được để trống')
    loading.value = true

    const post = await Post.create({
      uid: cuser?.id!,
      content: text.value,
      attachment: imageUpload.value!,
      isNormalPost: true,
      privacy: cprivacy.value.type
    })

    if (post.attachment) {
      const attachment = await Attachment.get(post.attachment as string)
      posts.value?.unshift({ ...post, attachment: attachment.attachments })
    } else posts.value?.unshift(post)

    isPostOverlay.value = false
    loading.value = false
    toast.success('Đã đăng thành công')
  } catch (error: any) {
    loading.value = false
    error.value = error
    toast.error('Đã có lỗi xảy ra')
  }
}

const setPrivacy = (type: Privacy) => {
  const privacy = PrivacyOptions.find((item) => item.type === type)
  cprivacy.value = privacy!
}

const getUploadedImage = (e: any) => {
  error.value = null
  const fileReader = new FileReader()
  fileReader.readAsDataURL(e.target.files[0])

  fileReader.addEventListener('load', function (event: Event) {
    imageView.value = (event.target as any).result
  })
  imageUpload.value = e.target.files[0]
}

const clearImage = () => {
  if (loading.value) return
  error.value = null
  imageUpload.value = null
  imageView.value = null
}

const disabledButton = computed(() => !text.value || loading.value)

watch(text, (newValue) => {
  textLines.value = newValue?.split('\n')?.length || 1
  rows.value = textLines.value <= 3 ? 3 : textLines.value
})
</script>

<template>
  <OptionsOverlayLayout>
    <div class="flex items-center relative my-3.5 mx-1">
      <div class="text-[22px] font-semibold w-full text-center">Tạo bài viết</div>
      <i
        @click="isPostOverlay = false"
        class="pi pi-times absolute bg-zinc-200 p-2 m-2 right-2 rounded-full border cursor-pointer text-[#5E6771]"
        :style="{ fontSize: 'xlarge' }"
      />
    </div>

    <div class="border-t border-t-gray-300" v-if="cuser">
      <div class="px-4 py-2">
        <div class="flex items-center mb-2">
          <img
            :src="cuser.photoURL"
            :alt="cuser.displayName"
            class="max-w-[50px] max-h-[50px] avatar"
          />
          <div class="ml-4 relative">
            <div class="font-medium text-[#050505] text-[15px]">{{ cuser.displayName }}</div>
            <Menu>
              <MenuButton
                class="px-3 py-1 rounded-lg flex items-center gap-1 bg-zinc-200 justify-between hover:cursor-pointer"
              >
                <div class="flex flex-row space-x-2 items-center justify-center">
                  <img
                    v-if="cprivacy.type === Privacy.PUBLIC"
                    :src="menuItems[0].icon"
                    class="w-4 h-4"
                  />
                  <img
                    v-else-if="cprivacy.type === Privacy.FRIENDS"
                    :src="menuItems[1].icon"
                    class="w-4 h-4"
                  />
                  <img
                    v-else-if="cprivacy.type === Privacy.PRIVATE"
                    :src="menuItems[2].icon"
                    class="w-4 h-4"
                  />
                  <span
                    v-if="cprivacy.type === Privacy.PUBLIC"
                    class="font-sans font-semibold text-[13px] text-[#050505] w-full"
                    >{{ capitalize(menuItems[0].text) }}</span
                  >
                  <span
                    v-else-if="cprivacy.type === Privacy.FRIENDS"
                    class="font-sans font-semibold text-[13px] text-[#050505] w-full"
                    >{{ capitalize(menuItems[1].text) }}</span
                  >
                  <span
                    v-else-if="cprivacy.type === Privacy.PRIVATE"
                    class="font-sans font-semibold text-[13px] text-[#050505] w-full"
                    >{{ capitalize(menuItems[2].text) }}</span
                  >
                </div>
                <i class="pi pi-chevron-down text-sm pt-1 pl-2" style="font-size: 12px"></i>
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
                  class="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2"
                >
                  <MenuItem v-slot="{ active }" v-for="(item, index) in menuItems" :key="index">
                    <button
                      :class="[
                        active ? 'bg-gray-200' : 'bg-white',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 select-none space-x-4'
                      ]"
                      @click="() => setPrivacy(item.type as Privacy)"
                    >
                      <img :src="item.icon" class="w-5 h-5 mr-2" />
                      <span class="text-gray-700">{{ item.text }}</span>
                    </button>
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </div>

        <div class="max-h-[400px] -z-10 overflow-y-scroll overflow-x-hidden nice-scrollbar">
          <textarea
            v-model="text"
            ref="textarea"
            v-focustrap
            class="w-full border-0 mt-2 focus:ring-0 text-[22px] outline-none resize-none overflow-y-scroll overflow-x-hidden nice-scrollbar -z-1 font-medium"
            placeholder="Bạn đang nghĩ gì?"
            cols="30"
            :rows="rows"
            :disabled="loading"
          ></textarea>
          <div
            v-if="imageView"
            class="p-2 border border-gray-300 rounded-lg relative overflow-hidden"
          >
            <i
              @click="clearImage()"
              class="pi pi-times absolute bg-white pl-2 pt-1 m-2 right-2 rounded-full border cursor-pointer text-[#5E6771] text-lg w-9 h-9"
            />
            <img v-if="imageView" class="rounded-lg mx-auto" :src="imageView" />
          </div>
        </div>

        <div class="bg-white">
          <div class="flex flex-row justify-start w-full bg-white mt-5">
            <div class="cursor-pointer w-10">
              <img src="/icons/text-color.png" alt="" />
            </div>
          </div>

          <div class="border-2 rounded-xl mt-4 shadow-sm flex items-center justify-between">
            <div class="font-medium p-4 text-sm text-[#050505]">Thêm vào bài viết của bạn</div>
            <div class="flex items-center pr-2">
              <label for="image" class="hover:bg-gray-200 rounded-full p-2 cursor-pointer">
                <img src="/icons/images.png" alt="" />
              </label>
              <input
                id="image"
                accept="image/*"
                class="hidden"
                type="file"
                @input="getUploadedImage($event)"
              />
              <button class="hover:bg-gray-200 rounded-full p-2 cursor-pointer">
                <img src="/icons/tag.png" alt="" />
              </button>
              <button class="hover:bg-gray-200 rounded-full p-2 cursor-pointer">
                <img src="/icons/emotion.png" alt="" />
              </button>
              <button class="hover:bg-gray-200 rounded-full p-2 cursor-pointer">
                <img src="/icons/location.png" alt="" />
              </button>
              <button class="hover:bg-gray-200 rounded-full p-2 cursor-pointer">
                <img src="/icons/gif.png" alt="" />
              </button>
              <button class="hover:bg-gray-200 rounded-full cursor-pointer">
                <i class="pi pi-ellipsis-h p-2.5 text-[#5E6771]" />
              </button>
            </div>
          </div>

          <div v-if="error">
            <div class="w-full bg-red-100 text-red-700 rounded-lg mt-3 text-center">
              <div class="p-0.5">
                {{ error }}
              </div>
            </div>
          </div>

          <button
            @click="createPost"
            :disabled="disabledButton || error"
            type="button"
            class="cursor-pointer w-full bg-mb-blue hover:bg-blue-500 text-white font-bold px-1.5 py-2 mt-3 rounded-lg my-1 disabled:bg-zinc-200 disabled:text-[#050505] disabled:hover:bg-zinc-300 disabled:cursor-not-allowed"
          >
            <i class="pi pi-spin pi-spinner" v-if="loading" />
            <span v-else>Đăng</span>
          </button>
        </div>
      </div>
    </div>
  </OptionsOverlayLayout>
</template>
