<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  fill: {
    type: String as PropType<`#${string}`>,
    default: '#0084FF'
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
    :fill="props.fill"
    viewBox="0 0 20 20"
    :width="props.size"
    :height="props.size"
  >
    <defs>
      <linearGradient gradientTransform="rotate(90)" id=":r40:">
        <stop offset="0%" :stop-color="props.fill"></stop>
        <stop offset="100%" :stop-color="props.fill"></stop>
      </linearGradient>
    </defs>
    <defs>
      <mask id=":r3v:">
        <rect fill="white" height="100%" width="100%"></rect>
        <circle cx="10" cy="10" fill="black" r="3"></circle>
      </mask>
    </defs>
    <circle cx="10" cy="10" r="10" mask="url(#:r3v:)" fill='url("#:r40:")'></circle>
  </svg>
</template>
