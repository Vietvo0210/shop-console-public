<template>
  <modal :footer="null" mask-closable>
    <a-image :src="url" :alt="alt" :preview="false" />
  </modal>
</template>

<script>
export default {
  name: 'ModalPreviewImage',
}
</script>

<script setup>
import Modal from '@/components/Modal'

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: 'Preview image',
  },
})
</script>
