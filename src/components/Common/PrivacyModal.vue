<script setup lang="ts">
import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption
} from '@headlessui/vue'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import { onMounted, ref } from 'vue'

import { Post } from '@/database/post'
import { Logger } from '@/helpers/logger'
import OptionsOverlayLayout from '@/layouts/OptionsOverlayLayout.vue'
import { PrivacyOptions } from '@/shared/constants'
import { useGeneral } from '@/stores/general'
const emit = defineEmits(['showModal'])

const { privacyModalPid } = storeToRefs(useGeneral())
const cprivacy = ref(PrivacyOptions[0])

onMounted(async () => {
  const post = await Post.get({ pid: privacyModalPid.value })
  if (!post) return
  cprivacy.value = PrivacyOptions.find((p) => p.type === post.privacy) || PrivacyOptions[0]
})

const close = () => emit('showModal', false)

const save = async () => {
  if (!privacyModalPid.value) return
  await Post.update(privacyModalPid.value, { privacy: cprivacy.value.type })
  Logger.info('PrivacyModal', 'save', 'Update privacy successfully')
  close()
}
</script>
<template>
  <OptionsOverlayLayout>
    <div class="flex items-center relative my-3.5 mx-1">
      <div class="text-[22px] font-semibold w-full text-center">Chỉnh sửa quyền riêng tư</div>
      <i
        @click="$emit('showModal', false)"
        class="pi pi-times absolute bg-zinc-200 p-2 m-2 right-2 rounded-full border cursor-pointer text-[#5E6771]"
        :style="{ fontSize: 'xlarge' }"
      />
    </div>
    <div class="border-t p-0.5"></div>
    <RadioGroup v-model="cprivacy" as="div" class="p-2">
      <RadioGroupLabel class="sr-only">Privacy Mode</RadioGroupLabel>
      <div class="space-y-2">
        <RadioGroupOption
          as="template"
          v-for="privacy in PrivacyOptions"
          :key="privacy.type"
          :value="privacy"
          v-slot="{ checked }"
        >
          <div
            :class="[checked ? 'bg-[#1d85fc] bg-opacity-10' : 'bg-white hover:bg-zinc-50']"
            class="relative flex cursor-pointer rounded-lg px-5 py-4 focus:outline-none justify-center items-center space-x-4"
          >
            <div class="flex justify-center items-center relative">
              <div class="bg-mb-gray p-7 rounded-full"></div>
              <img
                :src="privacy.icon"
                :alt="privacy.type"
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6"
              />
            </div>
            <div class="flex w-full items-center justify-between">
              <div class="flex items-center">
                <div>
                  <RadioGroupLabel as="p" class="font-medium text-lg">
                    {{ privacy.text }}
                  </RadioGroupLabel>
                  <RadioGroupDescription as="span" class="inline text-md text-gray-500">
                    {{ privacy.description }}
                  </RadioGroupDescription>
                </div>
              </div>
              <div v-show="checked" class="shrink-0 text-white">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#0000FF" fill-opacity="0.5" />
                  <path
                    d="M7 13l3 3 7-7"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </RadioGroupOption>
      </div>
    </RadioGroup>

    <div class="w-full flex justify-end items-end p-3 border-t">
      <div class="flex flex-row w-1/2">
        <Button class="w-full" label="Hủy" text @click="close" />
        <Button class="w-full" label="Lưu" @click="save" />
      </div>
    </div>
  </OptionsOverlayLayout>
</template>
