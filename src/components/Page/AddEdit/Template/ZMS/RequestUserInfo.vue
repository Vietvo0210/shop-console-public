<template>
  <div class="flex flex-col gap-y-2">
    <element-list-v2 :elements="message.elements" :type="ZMSMessageType.REQUEST_USER_INFO" />
  </div>
</template>

<script>
export default {
  name: 'AddEditTemplateZmsRequestUserInfo',
}
</script>

<script setup>
import ElementListV2 from '@/components/Page/AddEdit/Template/ZMS/Element/ListV2'
import { ZMSMessageType } from '@/utils/enums'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})
</script>
