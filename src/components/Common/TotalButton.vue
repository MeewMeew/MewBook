<script setup lang="ts">
import type { PropType } from 'vue'
type ButtonType = 'submit' | 'button' | 'reset'
type ButtonStyle =
  | 'success'
  | 'warning'
  | 'danger'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'light'
  | 'dark'
  | 'link';

const props = defineProps({
  type: {
    type: String as PropType<ButtonType>,
    default: 'submit'
  },
  bstyle: {
    type: String as PropType<ButtonStyle>,
    default: 'primary'
  },
  width: {
    type: String,
    default: 'w-full'
  },
  height: {
    type: String,
    default: 'h-[50px]'
  }
})

const styleClasses = {
  success: 'bg-[#42B729] hover:bg-[#37A621] focus:ring focus:ring-green-500',
  warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring focus:ring-yellow-500',
  danger: 'bg-red-500 hover:bg-red-600 focus:ring focus:ring-red-500',
  primary: 'bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-500',
  secondary: 'bg-gray-500 hover:bg-gray-600 focus:ring focus:ring-gray-500',
  info: 'bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-500',
  light: 'bg-gray-100 hover:bg-gray-200 focus:ring focus:ring-gray-100',
  dark: 'bg-gray-800 hover:bg-gray-900 focus:ring focus:ring-gray-800',
  link: 'bg-transparent hover:bg-transparent focus:ring focus:ring-transparent'
}
</script>

<template>
  <button
    :type="props.type"
    :class="[styleClasses[props.bstyle], props.width, props.height]" 
    class="btn-login text-white font-bold rounded-lg focus:outline-none focus:ring text-xl"
  >
    <slot></slot>
  </button>
</template>
