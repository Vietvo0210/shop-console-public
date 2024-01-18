<template>
  <p class="italic">Đang phát triển...</p>
</template>

<script>
export default {
  name: 'ViewMessageZmsMediaSticker',
}
</script>

<script setup>
defineProps({
  template: {
    type: Object,
    required: true,
  },
})
</script>
