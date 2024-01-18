<template>
  <upload
    ref="uploadRef"
    accept="image/*"
    list-type="picture"
    upload-text="Ấn để chọn, hoặc kéo thả ảnh vào đây"
    dir="image"
    is-public
    class="mb-2"
    v-bind="$attrs"
    @preview="onPreview"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </upload>

  <modal-preview-image v-if="preview" v-model:visible="previewImageVisible" :url="$attrs.value" />
</template>

<script>
export default {
  name: 'UploadImage',
  inheritAttrs: false,
}
</script>

<script setup>
import { ref } from 'vue'
import Upload from '@/components/Upload'
import ModalPreviewImage from '@/components/Modal/PreviewImage'

defineProps({
  preview: {
    type: Boolean,
    default: true,
  },
})

const previewImageVisible = ref(false)
const uploadRef = ref(null)

const onPreview = () => {
  previewImageVisible.value = true
}

defineExpose({
  click: () => uploadRef.value.click(),
})
</script>
