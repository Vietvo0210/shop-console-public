<template>
  <div
    v-if="visible"
    class="absolute left-0 w-full z-2"
    :style="{ top: topPx, height: `calc(min(100vh, 100%) - ${topPx})` }"
  >
    <a-spin size="small" tip="Đang tải" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
  </div>
</template>

<script>
export default {
  name: 'Loading',
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  top: {
    type: [Number, String],
    default: 0,
  },
})

const topPx = computed(() => {
  let value = props.top
  if (/^[\d.]+$/.test(value)) {
    value += 'px'
  }
  return value
})
</script>
