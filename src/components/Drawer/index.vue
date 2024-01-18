<template>
  <a-drawer size="large" :mask-closable="false" @close="emit('update:visible', false)">
    <slot />

    <template #extra>
      <slot name="extra" />
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </a-drawer>
</template>

<script>
export default {
  name: 'Drawer',
}
</script>

<script setup>
const emit = defineEmits(['update:visible'])
</script>
