<template>
  <element-list-v3
    title="TIN GIAO DỊCH"
    :template-type="message.template_type"
    :elements="message.elements"
    :buttons="message.buttons"
  />
</template>

<script>
export default {
  name: 'AddEditTemplateZmsTransaction',
}
</script>

<script setup>
import ElementListV3 from '@/components/Page/AddEdit/Template/ZMS/Element/ListV3'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})
</script>
