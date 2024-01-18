<template>
  <element-list-v3
    title="TIN TRUYỀN THÔNG"
    :template-type="message.template_type"
    :elements="message.elements"
    :buttons="message.buttons"
  />
</template>

<script>
export default {
  name: 'AddEditTemplateZmsPromotion',
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
