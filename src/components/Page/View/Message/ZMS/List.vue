<template>
  <div class="flex flex-col gap-y-2">
    <element-list-v2 :elements="notEmpty(elements) ? elements : template.message.elements" />
    <element-buttons :buttons="notEmpty(buttons) ? buttons : template.message.buttons" />
  </div>
</template>

<script>
export default {
  name: 'ViewMessageZmsList',
}
</script>

<script setup>
import { notEmpty } from '@/utils/variable'
import ElementListV2 from '@/components/Page/View/Message/ZMS/Element/ListV2'
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

const elements = computed(() => props.replacedMessage.elements ?? [])
const buttons = computed(() => props.replacedMessage.buttons ?? [])
</script>
