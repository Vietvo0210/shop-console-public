<template>
  <component
    :is="'ATypography' + _.startCase(tag)"
    :ellipsis="tag === 'paragraph' ? { rows: 1, expandable: false, symbol: 'Xem thêm' } : true"
    :style="{ width: width + (isNaN(width) ? '' : 'px') }"
    class="mb-0"
  />
</template>

<script>
export default {
  name: 'Text',
}
</script>

<script setup>
import _ from 'lodash'

defineProps({
  tag: {
    type: String,
    default: 'text',
  },
  width: {
    type: [String, Number],
    default: 'auto',
  },
})
</script>
