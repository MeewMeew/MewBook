<script setup lang="ts">
const props = defineProps({
  fill: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: '24'
  }
})
</script>
<template>
  <svg
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    v-if="props.fill"
    viewBox="0 0 24 24"
    :width="props.size"
    :height="props.size"
  >
    <path
      d="M3.25 2.75a1.25 1.25 0 1 0 0 2.5h17.5a1.25 1.25 0 1 0 0-2.5H3.25zM2 12c0-.69.56-1.25 1.25-1.25h17.5a1.25 1.25 0 1 1 0 2.5H3.25C2.56 13.25 2 12.69 2 12zm0 8c0-.69.56-1.25 1.25-1.25h17.5a1.25 1.25 0 1 1 0 2.5H3.25C2.56 21.25 2 20.69 2 20z"
      fill="#0866FF"
    ></path>
  </svg>
  <svg
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    v-else
    viewBox="0 0 24 24"
    :width="props.size"
    :height="props.size"
  >
    <path
      d="M3.25 2.75a1.25 1.25 0 1 0 0 2.5h17.5a1.25 1.25 0 1 0 0-2.5H3.25zM2 12c0-.69.56-1.25 1.25-1.25h17.5a1.25 1.25 0 1 1 0 2.5H3.25C2.56 13.25 2 12.69 2 12zm0 8c0-.69.56-1.25 1.25-1.25h17.5a1.25 1.25 0 1 1 0 2.5H3.25C2.56 21.25 2 20.69 2 20z"
      fill="#65676B"
    ></path>
  </svg>
</template>
