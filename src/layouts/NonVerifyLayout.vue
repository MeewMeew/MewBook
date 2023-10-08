<script setup lang="ts">
</script>

<template>
  <div class="h-[100vh] flex flex-col items-center bg-gray-100">
    <div class="w-full h-14 bg-mb-blue top-0 flex items-center px-32 lg:px-48 xl:px-60 justify-between min-w-sm">
      <div class="text-white font-bold text-3xl">
        <span>mewbook</span>
      </div>
      <router-link :to="{ name: 'logout' }" class="text-white font-medium hover:underline">
        <span>Đăng xuất</span>
      </router-link>
    </div>
    <div class="h-3/4 flex justify-center items-center">
      <slot></slot>
    </div>
  </div>
</template>
