<template>
  <drawer>
    <slot />
    <loading :visible="loading" :top="65" />

    <template #extra>
      <component :is="Button" :loading="submitting" class="px-4" v-bind="submitProps" @click="emit('submit')" />
      <slot name="extra" />
    </template>
  </drawer>
</template>

<script>
export default {
  name: 'DrawerSave',
}
</script>

<script setup>
import { computed } from 'vue'
import Loading from '@/components/Loading'
import Drawer from '@/components/Drawer'
import BtnCreate from '@/components/Button/Create'
import BtnUpdate from '@/components/Button/Update'
import BtnSave from '@/components/Button/Save'
import BtnSetting from '@/components/Button/Setting'
import BtnImport from '@/components/Button/Import'

const props = defineProps({
  mode: {
    type: String,
    default: 'create',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
  submitProps: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['submit'])

let Button = computed(() => {
  const mapping = {
    create: BtnCreate,
    update: BtnUpdate,
    setting: BtnSetting,
    import: BtnImport,
  }
  return mapping[props.mode] ?? BtnSave
})
</script>
