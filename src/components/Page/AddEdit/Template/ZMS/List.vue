<template>
  <div class="flex flex-col gap-y-2">
    <element-list-v2 :elements="message.elements" />
    <element-buttons :buttons="message.buttons" />
  </div>
</template>

<script>
export default {
  name: 'AddEditTemplateZmsList',
}
</script>

<script setup>
import ElementListV2 from '@/components/Page/AddEdit/Template/ZMS/Element/ListV2'
import ElementButtons from '@/components/Page/AddEdit/Template/ZMS/Element/Buttons'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})
</script>
