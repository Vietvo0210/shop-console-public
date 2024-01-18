<template>
  <div class="relative rounded-md bg-sky-200 p-2 ml-4 min-h-[100px]">
    <span class="absolute w-0 h-0 bottom-4 -left-4 border-[1rem] border-transparent border-b-sky-200" />
    <p class="relative z-[1] text-[0.8rem] whitespace-pre-line mb-0" :class="{ 'text-slate-400': blank(text) }">
      {{ text ?? 'Nội dung tin nhắn' }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'ViewMessageElementSimpleText',
}
</script>

<script setup>
import { blank } from '@/utils/variable'

defineProps({
  text: {
    type: String,
    default: '',
  },
})
</script>
