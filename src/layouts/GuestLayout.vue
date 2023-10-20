<script setup lang="ts">
import { AppName, AppNameLowerCased } from '@/shared/constants'
const props = defineProps({
  hideLogo: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="h-[100vh] flex flex-col items-center pt-[100px] bg-gray-100">
    <div class="h-3/4 flex justify-center items-center">
      <div class="max-w-lg w-full flex flex-col lg:flex-row justify-around items-center">
        <div
          class="text-left flex flex-col lg:-mt-10 mb-10 items-center justify-center lg:items-start"
          v-if="!props.hideLogo"
        >
          <h1 class="text-mb-blue text-7xl font-bold px-6 py-3">{{ AppNameLowerCased }}</h1>
          <h2 class="lg:text-2xl font-normal px-6 text-center text-md lg:text-left w-4/5 lg:w-full">
            {{ AppName }} giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.
          </h2>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
