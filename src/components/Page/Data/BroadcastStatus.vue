<template>
  <data-enum enum="broadcast.status" :value="broadcast.status" :tooltip="tooltip" />
</template>

<script>
export default {
  name: 'DataBroadcastStatus',
}
</script>

<script setup>
import { BroadcastStatus } from '@/utils/enums'
import DataEnum from '@/components/Page/Data/Enum'
import { computed } from 'vue'

const props = defineProps({
  broadcast: {
    type: Object,
    required: true,
  },
})

const tooltip = computed(() => {
  if (props.broadcast.status === BroadcastStatus.ERROR) {
    return `${props.broadcast.error}: ${props.broadcast.error_message}`
  }
  return null
})
</script>
