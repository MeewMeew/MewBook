<script setup lang="ts">
const props = defineProps({
  showSidebar: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div class="flex flex-col h-full w-full border-l bg-white">
    <div class="h-screen flex w-full">
      <div class="flex-1 flex flex-col">
        <div class="border-b shadow-sm p-2 h-16 flex flex-row justify-between items-center">
          <slot name="header"></slot>
        </div>

        <div
          class="flex-1 flex flex-col-reverse bg-gray-100 p-4 overflow-y-auto max-h-[calc(100vh-175px)]"
        >
          <slot name="messages"></slot>
        </div>

        <div class="bg-white p-2 h-30">
          <slot name="input"></slot>
        </div>
      </div>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-x-1 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-1 opacity-0"
      >
        <div key="sidebar" class="w-1/4 p-4 border-l min-w-xs" v-if="props.showSidebar">
          <slot name="sidebar"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>
