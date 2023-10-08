<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps(['modelValue', 'placeholder'])

defineEmits(['update:modelValue'])

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (inputRef.value?.hasAttribute('autofocus')) {
    inputRef.value.focus()
  }
})

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<template>
  <input
    class="w-full border outline-none border-gray-300 focus:border-indigo-200 focus:ring-2 focus:ring-indigo-400 rounded-md shadow-sm p-3 text-lg font-medium"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    ref="inputRef"
    :placeholder="placeholder"
  />
</template>
