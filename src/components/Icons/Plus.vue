<script setup lang="ts">
const props = defineProps({
  fill: {
    type: String
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
    fill="currentfill"
    viewBox="0 0 20 20"
    :width="props.size"
    :height="props.size"
  >
    <g fill-rule="evenodd" transform="translate(-446 -350)" :fill="props.fill">
      <g fill-rule="nonzero" :fill="props.fill">
        <path
          d="M95 201.5h13a1 1 0 1 0 0-2H95a1 1 0 1 0 0 2z"
          transform="translate(354.5 159.5)"
          :fill="props.fill"
        ></path>
        <path
          d="M102.5 207v-13a1 1 0 1 0-2 0v13a1 1 0 1 0 2 0z"
          transform="translate(354.5 159.5)"
          :fill="props.fill"
        ></path>
      </g>
    </g>
  </svg>
</template>
