<template>
  <element-simple-text :value="message.text" class="w-[320px]" />
</template>

<script>
export default {
  name: 'AddEditTemplateSms',
}
</script>

<script setup>
import ElementSimpleText from '@/components/Page/AddEdit/Template/Element/SimpleText'
import { setMany } from '@/utils/collection'
import { provide } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:message'])

const onChange = values => {
  emit('update:message', setMany(props.message, values))
}
provide('onChange', onChange)
</script>
