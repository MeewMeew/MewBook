<script setup lang="ts">
import MainNavLayout from '@/layouts/MainNavLayout.vue'
</script>
<template>
  <MainNavLayout select="friends">
    <div class="fixed w-full h-full bg-[#F1F2F5] top-0 flex flex-row pt-10">
      <div class="hidden h-full bg-white w-1/4 shadow-xl mt-4 p-4 md:flex flex-col min-w-[380px]">
        <slot name="sidebar"></slot>
      </div>
      <div class="w-full mt-4">
        <slot name="view"></slot>
      </div>
    </div>
  </MainNavLayout>
</template>
