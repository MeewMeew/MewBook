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
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false
  }
})
</script>

<template>
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    v-if="!props.disabled"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
  >
    <g
      transform="translate(0.000000,24.000000) scale(0.100000,-0.100000)"
      :fill="props.fill"
      stroke="none"
    >
      <path
        d="M14 215 c-3 -8 -1 -30 6 -50 11 -34 13 -35 61 -35 27 0 49 -4 49 -10 0 -5 -22 -10 -50 -10 -49 0 -49 0 -61 -40 -21 -69 -4 -72 111 -15 63 31 100 55 100 65 0 10 -36 33 -95 63 -104 52 -113 54 -121 32z"
      />
    </g>
  </svg>
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    v-else
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
  >
    <g
      transform="translate(0.000000,24.000000) scale(0.100000,-0.100000)"
      fill="#65676B"
      stroke="none"
    >
      <path
        d="M14 215 c-3 -8 -1 -30 6 -50 11 -34 13 -35 61 -35 27 0 49 -4 49 -10 0 -5 -22 -10 -50 -10 -49 0 -49 0 -61 -40 -21 -69 -4 -72 111 -15 63 31 100 55 100 65 0 10 -36 33 -95 63 -104 52 -113 54 -121 32z"
      />
    </g>
  </svg>
</template>
