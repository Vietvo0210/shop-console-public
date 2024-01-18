<template>
  <form-item name="code" label="Mã">
    <a-input
      :value="value"
      :readonly="readonly"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :class="{ 'bg-slate-100': readonly }"
      @change="onChange($event.target.value)"
    >
      <template v-if="!readonly" #addonAfter>
        <btn v-if="canRandom" theme="primary" icon="refresh-cw" tooltip="Tạo ngẫu nhiên" only-icon @click="onRandom" />
        <slot name="addonAfter" />
      </template>
    </a-input>
    <small v-if="notBlank(note)" class="text-slate-500">{{ note }}</small>
  </form-item>
</template>

<script>
export default {
  name: 'ControlCode',
}
</script>

<script setup>
import FormItem from '@/components/Form/Item'
import randomstring from 'randomstring'
import Btn from '@/components/Button'
import { notBlank } from '@/utils/variable'

const props = defineProps({
  value: {
    type: [String, Number],
  },
  readonly: {
    type: Boolean,
    default: true,
  },
  canRandom: {
    type: Boolean,
    default: true,
  },
  maxlength: {
    type: Number,
    default: 16,
  },
  placeholder: {
    type: String,
    default: '',
  },
  note: {
    type: String,
    default: 'Sẽ tạo ngẫu nhiên nếu không nhập',
  },
  randomPrefix: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:value'])

const onChange = value => {
  emit('update:value', value.replace(/[\s\W]+/g, '').toUpperCase())
}

const onRandom = () => {
  const value
    = props.randomPrefix
    + randomstring.generate({
      length: props.maxlength - props.randomPrefix.length,
      charset: 'alphanumeric',
      capitalization: 'uppercase',
    })
  emit('update:value', value)
}
</script>
