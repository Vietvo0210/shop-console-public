<template>
  <a-modal
    :title="h('span', { class: 'text-indigo-500 font-bold' }, title)"
    ok-text="OK"
    :mask-closable="false"
    :cancel-button-props="{ class: { hidden: hiddenCancelButton } }"
    @cancel="emit('update:visible', false)"
  >
    <slot />
    <loading :visible="loading" :top="55" />
  </a-modal>
</template>

<script>
export default {
  name: 'Modal',
}
</script>

<script setup>
import { h } from 'vue'
import Loading from '@/components/Loading'

defineProps({
  title: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hiddenCancelButton: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible'])
</script>
