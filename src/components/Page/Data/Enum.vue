<template>
  <div v-if="option" class="flex items-center gap-x-1" :class="colorClass">
    <icon-fe v-if="notBlank(option.icon)" :type="option.icon" />
    <a-tooltip :title="notBlank(tooltip) || $slots.tooltip ? tooltip : false">
      <template #title>
        <slot name="tooltip" />
      </template>
      <span v-bind="$attrs">{{ option.label }}</span>
    </a-tooltip>
  </div>
</template>

<script>
export default {
  name: 'DataEnum',
  inheritAttrs: false,
}
</script>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { blank, notBlank } from '@/utils/variable'
import IconFe from '@/components/Icon/Fe'

const props = defineProps({
  enum: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    default: '',
  },
  tooltip: {
    type: String,
    default: '',
  },
})

const store = useStore()

const option = computed(() => {
  const enums = store.getters['dropdown/getEnum'](props.enum)
  return _.find(enums, ['value', props.value])
})

const colorClass = computed(() => {
  let color = option.value.color
  if (blank(color)) {
    return 'text-current'
  }
  const mapping = {
    slate: 'text-slate-500',
    gray: 'text-gray-500',
    zinc: 'text-zinc-500',
    neutral: 'text-neutral-500',
    stone: 'text-stone-500',
    red: 'text-red-500',
    orange: 'text-orange-500',
    amber: 'text-amber-500',
    yellow: 'text-yellow-500',
    lime: 'text-lime-500',
    green: 'text-green-500',
    emerald: 'text-emerald-500',
    teal: 'text-teal-500',
    cyan: 'text-cyan-500',
    sky: 'text-sky-500',
    blue: 'text-blue-500',
    indigo: 'text-indigo-500',
    violet: 'text-violet-500',
    purple: 'text-purple-500',
    fuchsia: 'text-fuchsia-500',
    pink: 'text-pink-500',
    rose: 'text-rose-500',
  }
  return mapping[color]
})
</script>
