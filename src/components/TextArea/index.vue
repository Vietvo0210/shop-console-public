<template>
  <a-textarea ref="inputRef" :auto-size="autoSize" />
</template>

<script>
export default {
  name: 'TextArea',
}
</script>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  autoSize: {
    type: [Object, Boolean],
    default: () => ({ minRows: 2 }),
  },
})

const inputRef = ref(null)

watch(
  () => props.autoSize,
  () => {
    setTimeout(() => inputRef.value?.resizableTextArea.resizeTextarea(), 1)
  },
  { immediate: true },
)
</script>
