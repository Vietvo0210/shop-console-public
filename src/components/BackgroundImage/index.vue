<template>
  <div
    ref="containerRef"
    class="bg-cover bg-no-repeat bg-center"
    :style="{ backgroundImage: `url(${notBlank(src) ? src : NO_IMAGE})` }"
  >
    <img :src="src" class="hidden" @error="onError" />
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BgImg',
}
</script>

<script setup>
import { ref } from 'vue'
import { notBlank } from '@/utils/variable'

const NO_IMAGE = '/no-image.png'

defineProps({
  src: {
    type: String,
    required: true,
  },
})

const containerRef = ref(null)

const onError = () => {
  containerRef.value.style.backgroundImage = NO_IMAGE
}
</script>
