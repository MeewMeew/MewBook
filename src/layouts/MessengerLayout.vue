<script setup lang="ts">
import MainNavLayout from '@/layouts/MainNavLayout.vue'
</script>
<template>
  <MainNavLayout select="none" hide="messenger">
    <div class="fixed w-full h-full min-w-sm bg-[#F1F2F5] top-0 flex flex-row pt-10">
      <div class="flex flex-col h-full bg-white w-24 md:w-96 md:min-w-[380px] shadow-xl mt-4">
        <slot name="sidebar"></slot>
      </div>
      <div class="w-full mt-4">
        <slot name="view"></slot>
      </div>
    </div>
  </MainNavLayout>
</template>
