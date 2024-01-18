<template>
  <a-time-picker :value-format="valueFormat" :format="format" placeholder="Chọn giờ" class="w-full" />
</template>

<script>
export default {
  name: 'TimePicker',
}
</script>

<script setup>
import { TIME_FORMAT } from '@/utils/consts'
import { computed } from 'vue'

const props = defineProps({
  showSecond: {
    type: Boolean,
    default: false,
  },
  isEndTime: {
    type: Boolean,
    default: false,
  },
})

const getFormat = (timeFormat, suffix = '') => {
  let fmt = timeFormat
  if (!props.showSecond) {
    fmt = fmt.replace(/:ss$/, suffix)
  }
  return fmt
}

const valueFormat = computed(() => {
  const suffix = ':' + (props.isEndTime ? '59' : '00')
  return getFormat(TIME_FORMAT, suffix)
})
const format = computed(() => {
  return getFormat(TIME_FORMAT)
})
</script>
