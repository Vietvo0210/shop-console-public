<template>
  <div v-for="(err, index) in errors" :key="index" role="alert" class="ant-form-item-explain-error">
    {{ err }}
  </div>
</template>

<script>
export default {
  name: 'FormError',
}
</script>

<script setup>
import { computed, inject } from 'vue'
import _ from 'lodash'
import cast from '@/utils/cast'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const errors = computed(() => {
  const allErrors = _.get(inject('errors', {}), 'value', {})
  return cast.toArray(allErrors[props.name || 'undefined'])
})
</script>
