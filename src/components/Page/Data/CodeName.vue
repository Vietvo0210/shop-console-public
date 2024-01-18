<template>
  <div v-if="model" class="flex items-center gap-x-2">
    <tag theme="primary">{{ model[codeField] }}</tag>
    <span>{{ model[nameField] }}</span>
  </div>
</template>

<script>
export default {
  name: 'DataCodeName',
}
</script>

<script setup>
import Tag from '@/components/Tag'

defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
  codeField: {
    type: String,
    default: 'code',
  },
  nameField: {
    type: String,
    default: 'name',
  },
})
</script>
