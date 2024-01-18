<template>
  <div class="table-responsive" :class="wrapperClass">
    <a-table
      :show-sorter-tooltip="false"
      bordered
      row-key="id"
      :scroll="{ x: $attrs.sticky ? 900 : 0 }"
      v-bind="$attrs"
    >
      <template v-for="slot in _.keys($slots)" #[slot]="options">
        <slot :name="slot" v-bind="options ?? {}" />
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'Tbl',
  inheritAttrs: false,
}
</script>

<script setup>
import _ from 'lodash'

defineProps({
  wrapperClass: {
    type: String,
    default: '',
  },
})
</script>
