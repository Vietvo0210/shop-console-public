<template>
  <a-form-item class="mb-0" :class="{ 'hidden-label': !showLabel }">
    <template #extra>
      <form-error :name="$attrs.name" />
    </template>

    <slot />
  </a-form-item>
</template>

<script>
export default {
  name: 'FormItem',
}
</script>

<script setup>
import FormError from '@/components/Form/Errors'

defineProps({
  showLabel: {
    type: Boolean,
    default: true,
  },
})
</script>
