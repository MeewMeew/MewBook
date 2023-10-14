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
    fill="currentColor"
    viewBox="0 0 24 24"
    :width="props.size"
    :height="props.size"
  >
    <g fill-rule="evenodd" fill="#BCC0C4">
      <polygon fill="none" points="-6,30 30,30 30,-6 -6,-6 "></polygon>
      <path
        d="m18,11l-5,0l0,-5c0,-0.552 -0.448,-1 -1,-1c-0.5525,0 -1,0.448 -1,1l0,5l-5,0c-0.5525,0 -1,0.448 -1,1c0,0.552 0.4475,1 1,1l5,0l0,5c0,0.552 0.4475,1 1,1c0.552,0 1,-0.448 1,-1l0,-5l5,0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1m-6,13c-6.6275,0 -12,-5.3725 -12,-12c0,-6.6275 5.3725,-12 12,-12c6.627,0 12,5.3725 12,12c0,6.6275 -5.373,12 -12,12"
        :fill="props.fill"
      ></path>
    </g>
  </svg>
</template>
