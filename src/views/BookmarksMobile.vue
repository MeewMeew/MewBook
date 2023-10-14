<script lang="ts" setup>
import ShortcutMenu from '@/components/Common/ShortcutMenu.vue'
</script>

<template>
  <MainNavLayout select="bookmarks">
    <div class="fixed w-full h-full bg-[#F1F2F5] top-0 flex flex-row pt-10">
      <ShortcutMenu />
    </div>
  </MainNavLayout>
</template>

<style scoped lang="scss"></style>
