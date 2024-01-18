<template>
  <div class="flex flex-col gap-y-2">
    <element-simple-text :value="message.text" />
    <element-buttons :buttons="message.buttons" />
  </div>
</template>

<script>
export default {
  name: 'AddEditTemplateZmsText',
}
</script>

<script setup>
import ElementSimpleText from '@/components/Page/AddEdit/Template/Element/SimpleText'
import ElementButtons from '@/components/Page/AddEdit/Template/ZMS/Element/Buttons'

defineProps({
  message: {
    type: Object,
    required: true,
  },
})
</script>
