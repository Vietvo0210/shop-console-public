<template>
  <element-simple-text :text="finalText ?? replacedText ?? template.message.text" />
</template>

<script>
export default {
  name: 'ViewMessageSms',
}
</script>

<script setup>
import ElementSimpleText from '@/components/Page/View/Message/Element/SimpleText'

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
  replacedText: {
    type: String,
    default: '',
  },
  finalText: {
    type: String,
    default: '',
  },
})
</script>
