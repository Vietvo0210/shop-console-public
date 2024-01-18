<template>
  <tbl :data-source="list[listKey]" :pagination="paginationOptions">
    <template v-for="slot in _.keys($slots)" #[slot]="options">
      <slot :name="slot" v-bind="options ?? {}" />
    </template>
  </tbl>
</template>

<script>
export default {
  name: 'TblList',
}
</script>

<script setup>
import Tbl from '@/components/Table'
import _ from 'lodash'
import { paginationOptions as basePaginationOptions } from '@/utils/tables'
import { computed } from 'vue'

const props = defineProps({
  list: {
    type: Object,
    default: () => ({}),
  },
  listKey: {
    type: String,
    default: 'items',
  },
})

const paginationOptions = computed(() => basePaginationOptions(props.list))
</script>
