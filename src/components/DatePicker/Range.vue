<template>
  <a-range-picker
    :locale="datePickerVi()"
    :show-time="showTime"
    :value-format="valueFormat"
    :format="format"
    :placeholder="[`Ngày${showTime ? ' giờ' : ''} bắt đầu`, `Ngày${showTime ? ' giờ' : ''} kết thúc`]"
    class="w-full"
    :value="[from, to]"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'DatePickerRange',
}
</script>

<script setup>
import { datePickerVi } from '@/utils/locale/vi'
import { DATETIME_FORMAT, DATE_FORMAT, DATETIME_FORMAT_VN, DATE_FORMAT_VN } from '@/utils/consts'
import { computed, watch } from 'vue'
import cast from '@/utils/cast'
import { empty } from '@/utils/variable'

const props = defineProps({
  from: {
    type: String,
    default: '',
  },
  to: {
    type: String,
    default: '',
  },
  showTime: {
    type: [Boolean, Object],
    default: false,
  },
  showSecond: {
    type: Boolean,
    default: false,
  },
  maxDuration: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:from', 'update:to'])

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
  return getFormat(DATE_FORMAT, DATETIME_FORMAT)
})
const format = computed(() => {
  return getFormat(DATE_FORMAT_VN, DATETIME_FORMAT_VN)
})

const onChange = dates => {
  let [from, to] = dates ?? []
  if (props.showTime && !props.showSecond) {
    from = from.replace(':\d{2}$', '') + ':00'
    to = to.replace(':\d{2}$', '') + ':59'
  }
  emit('update:from', from)
  emit('update:to', to)
}

const onWatch = (date, partial) => {
  if (empty(props.maxDuration)) {
    return
  }

  date = cast.toDayjs(date)
  const isFrom = partial === 'from'

  // Default other date
  const defaultOtherDate = date
    .clone()
    [isFrom ? 'add' : 'subtract'](...props.maxDuration)
    [isFrom ? 'subtract' : 'add'](1, 'day')
    [isFrom ? 'endOf' : 'startOf']('day')

  const otherPartial = isFrom ? 'to' : 'from'
  let otherDate = props[otherPartial]

  // Other date is over default value
  if (defaultOtherDate[isFrom ? 'isBefore' : 'isAfter'](otherDate)) {
    emit('update:' + otherPartial, defaultOtherDate.format(valueFormat.value))
  }
}

watch(
  () => props.from,
  value => onWatch(value, 'from'),
)
watch(
  () => props.to,
  value => onWatch(value, 'to'),
)
</script>
