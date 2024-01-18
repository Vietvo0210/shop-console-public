<template>
  <pop-confirm
    :disabled="!confirm"
    :title="confirm"
    :icon="h(DeleteOutlined, { class: 'text-red-500' })"
    ok-type="danger"
    @confirm="emit('click')"
  >
    <template #icon>
      <icon-fe type="x-octagon" class="text-red-500" />
    </template>
    <btn theme="danger" icon="trash-2" text="Xóa" v-bind="$attrs" @click="onClick" />
  </pop-confirm>
</template>

<script>
export default {
  name: 'BtnDelete',
  inheritAttrs: false,
}
</script>

<script setup>
import { h } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import PopConfirm from '@/components/PopConfirm'
import Btn from '@/components/Button'
import IconFe from '@/components/Icon/Fe'

const props = defineProps({
  confirm: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])

const onClick = () => {
  if (!props.confirm) {
    emit('click')
  }
}
</script>
