<template>
  <div
    v-for="(button, btnIndex) in buttons"
    :key="btnIndex"
    class="relative rounded-md bg-slate-300 flex items-center justify-center overflow-hidden px-5 py-1 ml-4"
  >
    <span class="text-[0.8rem] text-white">{{ button.title }}</span>
    <a-tooltip>
      <template #title>
        <component :is="getActionLabel(button, 'button')" />
      </template>
      <icon-fe
        type="settings"
        class="absolute right-[0.125rem] text-red-500 cursor-pointer opacity-50 hover:opacity-100"
      />
    </a-tooltip>
  </div>
</template>

<script>
export default {
  name: 'ViewMessageZmsElementButtons',
}
</script>

<script setup>
import { getActionLabel } from '@/components/Modal/Zalo/ZMS/SelectAction'
import IconFe from '@/components/Icon/Fe'

defineProps({
  buttons: {
    type: Array,
    required: true,
  },
})
</script>
