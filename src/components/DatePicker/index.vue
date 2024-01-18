<template>
  <a-date-picker
    :locale="datePickerVi()"
    :show-time="showTime"
    :value-format="valueFormat"
    :format="format"
    :placeholder="`Chọn ngày` + (showTime ? ' giờ' : '')"
    class="w-full"
  />
</template>

<script>
export default {
  name: 'DatePicker',
}
</script>

<script setup>
import { datePickerVi } from '@/utils/locale/vi'
import { DATETIME_FORMAT, DATE_FORMAT, DATETIME_FORMAT_VN, DATE_FORMAT_VN } from '@/utils/consts'
import { computed } from 'vue'

const props = defineProps({
  showTime: {
    type: [Boolean, Object],
    default: false,
  },
  showSecond: {
    type: Boolean,
    default: false,
  },
  isEndTime: {
    type: Boolean,
    default: false,
  },
})

const getFormat = (dateFormat, datetimeFormat, suffix = '') => {
  if (!props.showTime) {
    return dateFormat
  }
  let fmt = datetimeFormat
  if (!props.showSecond) {
    fmt = fmt.replace(/:ss$/, suffix)
  }
  return fmt
}

const valueFormat = computed(() => {
  const suffix = ':' + (props.isEndTime ? '59' : '00')
  return getFormat(DATE_FORMAT, DATETIME_FORMAT, suffix)
})
const format = computed(() => {
  return getFormat(DATE_FORMAT_VN, DATETIME_FORMAT_VN)
})
</script>
