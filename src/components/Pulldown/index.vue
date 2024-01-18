<template>
  <a-select allow-clear show-search placeholder="Vui lòng chọn" :filter-option="filterDropdownOption" class="w-full">
    <template #option="option">
      <div class="flex items-center gap-x-2">
        <tag v-if="notBlank(codeField)" theme="primary" class="text-[80%]">{{ option?.[codeField] }}</tag>
        <span>{{ option.label }}</span>
        <slot name="extra" v-bind="option" />
      </div>
    </template>

    <template v-for="slot in _.pull(_.keys($slots), 'default')" #[slot]="options">
      <slot :name="slot" v-bind="options ?? {}" />
    </template>
  </a-select>
</template>

<script>
export default {
  name: 'Pulldown',
}
</script>

<script setup>
import _ from 'lodash'
import { filterDropdownOption } from '@/utils/dropdown'
import Tag from '@/components/Tag'
import { ifBlank, notBlank } from '@/utils/variable'
import { computed } from 'vue'

const props = defineProps({
  withCode: {
    type: [String, Boolean],
    default: false,
  },
})

const codeField = computed(() => {
  return props.withCode !== false ? ifBlank(props.withCode, 'code') : ''
})
</script>
