<template>
  <a-tooltip :title="tooltip">
    <button
      type="button"
      class="ant-btn inline-flex items-center justify-center rounded-md gap-x-2"
      :class="themeClass"
      :disabled="disabled || loading"
      v-bind="$attrs"
    >
      <icon-fe v-if="loading" type="loader" class="animate-spin" />
      <icon-fe v-else-if="notBlank(icon)" :type="icon" :class="iconClass" />
      <template v-if="!onlyIcon">{{ text }}</template>
    </button>
  </a-tooltip>
</template>

<script>
export default {
  name: 'Btn',
  inheritAttrs: false,
}
</script>

<script setup>
import { notBlank } from '@/utils/variable'
import IconFe from '@/components/Icon/Fe'
import { computed } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    default: 'default',
  },
  onlyIcon: {
    type: Boolean,
    default: false,
  },
  tooltip: {
    type: String,
    default: '',
  },
  iconClass: {
    type: [String, Array, Object],
    default: '',
  },
})

const themeClass = computed(() => {
  const mapping = {
    save: [
      'bg-purple-500 text-white border-purple-600',
      'hover:bg-purple-600 hover:text-white hover:border-purple-700',
    ],
    primary: [
      'bg-indigo-500 text-white border-indigo-600',
      'hover:bg-indigo-600 hover:text-white hover:border-indigo-700',
    ],
    success: [
      'bg-emerald-500 text-white border-emerald-600',
      'hover:bg-emerald-600 hover:text-white hover:border-emerald-700',
    ],
    info: ['bg-sky-500 text-white border-sky-600', 'hover:bg-sky-600 hover:text-white hover:border-sky-700'],
    warning: ['bg-amber-500 text-white border-amber-600', 'hover:bg-amber-600 hover:text-white hover:border-amber-700'],
    danger: ['bg-red-500 text-white border-red-600', 'hover:bg-red-600 hover:text-white hover:border-red-700'],
    secondary: [
      'bg-slate-300 text-slate-800 border-slate-400',
      'hover:bg-slate-400 hover:text-slate-900 hover:border-slate-500',
    ],
    default: [
      'bg-slate-50 text-slate-700 border-slate-400',
      'hov,er:bg-slate-200 hover:text-slate-800 hover:border-slate-500',
    ],
    custom: [],
  }
  return mapping[props.theme ?? 'default']
})
</script>
