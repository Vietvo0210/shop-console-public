<template>
  <a-tooltip
    v-if="notBlank(message.error)"
    class="inline-flex items-center gap-x-1"
    :class="hasError ? 'text-red-500' : 'text-emerald-500'"
    :title="hasError ? `${message.error}: ${message.error_message}` : null"
  >
    <icon-fe :type="hasError ? 'alert-circle' : 'check'" />
    <template v-if="message.error">Thất bại</template>
    <template v-else>Thành công</template>
  </a-tooltip>
</template>

<script>
export default {
  name: 'DataMessageResult',
}
</script>

<script setup>
import { notBlank } from '@/utils/variable'
import IconFe from '@/components/Icon/Fe'
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const hasError = computed(() => props.message.error !== 0)
</script>
