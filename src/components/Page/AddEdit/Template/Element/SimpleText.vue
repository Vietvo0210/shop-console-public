<template>
  <form-item :name="['message', 'text']" label="Nội dung tin nhắn" :show-label="false" required>
    <div class="relative rounded-md bg-sky-200 p-2 ml-4">
      <span class="absolute w-0 h-0 bottom-4 -left-4 border-[1rem] border-transparent border-b-sky-200" />
      <text-area
        :value="value"
        :auto-size="{ minRows: 4 }"
        placeholder="Nội dung tin nhắn"
        class="bg-transparent p-1 border-2 border-dashed border-sky-300 text-[0.8rem] placeholder:text-slate-400"
        @change="onChange({ text: $event.target.value })"
        v-bind="inputProps"
      />
    </div>
  </form-item>
</template>

<script>
export default {
  name: 'AddEditTemplateElementSimpleText',
}
</script>

<script setup>
import FormItem from '@/components/Form/Item'
import TextArea from '@/components/TextArea'
import { inject } from 'vue'

defineProps({
  value: {
    type: String,
    required: true,
  },
  inputProps: {
    type: Object,
    default: () => ({}),
  },
})

const onChange = inject('onChange')
</script>
