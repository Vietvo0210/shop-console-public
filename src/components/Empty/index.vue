<template>
  <a-empty :image="imagePath" />
</template>

<script>
export default {
  name: 'Empty',
}
</script>

<script setup>
import { Empty } from 'ant-design-vue'

defineProps({
  imagePath: {
    type: [String, Object],
    default: Empty.PRESENTED_IMAGE_SIMPLE,
  },
})
</script>
