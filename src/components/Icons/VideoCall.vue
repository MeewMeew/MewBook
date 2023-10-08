<script lang="ts" setup>
const props = defineProps({
  color: {
    type: String,
    default: '#0084ff'
  },
  size: {
    type: Number,
    default: 24
  }
})
</script>

<template>
  <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" :fill="props.color" :height="props.size"
    role="presentation" viewBox="0 0 36 36" :width="props.size">
    <path
      d="M9 9.5a4 4 0 00-4 4v9a4 4 0 004 4h10a4 4 0 004-4v-9a4 4 0 00-4-4H9zm16.829 12.032l3.723 1.861A1 1 0 0031 22.5v-9a1 1 0 00-1.448-.894l-3.723 1.861A1.5 1.5 0 0025 15.81v4.38a1.5 1.5 0 00.829 1.342z"
      :fill="props.color"></path>
  </svg>
</template>