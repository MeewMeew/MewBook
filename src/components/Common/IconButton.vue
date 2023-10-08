<script lang="ts" setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    class="sm:px-5 lg:px-12 mx-1 py-2.5 rounded-lg sm:flex items-center gap-3 hover:bg-zinc-200 cursor-pointer"
    :class="[props.active ? 'border-b-2 border-mb-blue' : '']"
  >
    <slot></slot>
  </div>
</template>
