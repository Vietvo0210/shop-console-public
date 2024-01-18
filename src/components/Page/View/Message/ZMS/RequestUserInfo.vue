<template>
  <element-list-v2 :elements="notEmpty(elements) ? elements : template.message.elements" />
</template>

<script>
export default {
  name: 'ViewMessageZmsRequestUserInfo',
}
</script>

<script setup>
import { notEmpty } from '@/utils/variable'
import ElementListV2 from '@/components/Page/View/Message/ZMS/Element/ListV2'
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
</script>
