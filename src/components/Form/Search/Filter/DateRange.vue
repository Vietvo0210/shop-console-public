<template>
  <div class="flex items-center gap-x-2">
    <date-picker
      :value="from"
      show-time
      :show-second="false"
      v-bind="$attrs"
      @change="v => emit('update:from', v)"
    />
    <span>{{ separator }}</span>
    <date-picker
      :value="to"
      show-time
      :show-second="false"
      is-end-time
      v-bind="$attrs"
      @change="v => emit('update:to', v)"
    />
  </div>
</template>

<script>
export default {
  name: 'FilterDateRange',
}
</script>

<script setup>
import DatePicker from '@/components/DatePicker'

defineProps({
  from: {
    type: String,
    default: '',
  },
  to: {
    type: String,
    default: '',
  },
  separator: {
    type: String,
    default: '→',
  },
})

const emit = defineEmits(['update:from', 'update:to'])
</script>
