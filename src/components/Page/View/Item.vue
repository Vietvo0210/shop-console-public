<template>
  <div class="flex gap-x-4 p-4 first:pt-0 last:pb-0">
    <div v-if="notBlank(title)" class="flex-none font-bold w-[10rem]" :class="titleClass">{{ title }}</div>
    <div class="flex-auto" :class="textClass">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewItem',
}
</script>

<script setup>
import { notBlank } from '@/utils/variable'

defineProps({
  title: {
    type: String,
    default: '',
  },
  titleClass: {
    type: [String, Object, Array],
  },
  textClass: {
    type: [String, Object, Array],
  },
})
</script>
