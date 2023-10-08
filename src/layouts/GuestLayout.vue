<script setup lang="ts">
const props = defineProps({
  showLogo: Boolean
})
</script>

<template>
  <div class="h-[100vh] flex flex-col items-center pt-[100px] bg-gray-100">
    <router-link to="/login" v-if="props.showLogo">
      <img width="300" src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" />
    </router-link>
    <div class="h-3/4 flex justify-center items-center">
      <slot></slot>
    </div>
  </div>
</template>
