<template>
  <div class="flex flex-col gap-y-2">
    <element-simple-text :text="text ?? template.message.text" />
    <element-buttons :buttons="notEmpty(buttons) ? buttons : template.message.buttons" />
  </div>
</template>

<script>
export default {
  name: 'ViewMessageZmsText',
}
</script>

<script setup>
import { notEmpty } from '@/utils/variable'
import ElementSimpleText from '@/components/Page/View/Message/Element/SimpleText'
import ElementButtons from '@/components/Page/View/Message/ZMS/Element/Buttons'
import { computed } from 'vue'

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
  replacedMessage: {
    type: Object,
    default: () => ({}),
  },
})

const text = computed(() => props.replacedMessage.text)
const buttons = computed(() => props.replacedMessage.buttons ?? [])
</script>
