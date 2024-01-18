<template>
  <a-tooltip :title="tooltip">
    <a-tag :color="clr" class="mr-0" v-bind="$attrs">
      <slot />
    </a-tag>
  </a-tooltip>
</template>

<script>
export default {
  name: 'Tag',
  inheritAttrs: false,
}
</script>

<script setup>
import { computed, useAttrs } from 'vue'
import { notBlank } from '@/utils/variable'

const props = defineProps({
  theme: {
    type: String,
    default: 'default',
  },
  tooltip: {
    type: String,
    default: '',
  },
})

const attrs = useAttrs()

const clr = computed(() => {
  if (notBlank(attrs.color)) {
    return attrs.color
  }

  const mapping = {
    default: null,
    primary: '#6366f1',
    success: '#10b981',
    info: '#0ea5e9',
    warning: '#f59e0b',
    danger: '#ef4444',
    secondary: '#64748b',
  }
  return mapping[props.theme ?? 'default']
})
</script>
