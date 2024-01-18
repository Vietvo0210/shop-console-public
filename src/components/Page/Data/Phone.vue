<template>
  <div v-if="notBlank(phone)" class="flex items-center gap-x-1">
    <icon-fe type="phone" />
    <a-tooltip title="Ấn để gọi">
      <a :href="`tel:${phone}`">
        {{ phone }}
      </a>
    </a-tooltip>
  </div>
</template>

<script>
export default {
  name: 'DataPhone',
}
</script>

<script setup>
import IconFe from '@/components/Icon/Fe'
import { notBlank } from '@/utils/variable'

defineProps({
  phone: {
    type: String,
    required: true,
  },
})
</script>
