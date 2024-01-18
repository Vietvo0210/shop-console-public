<template>
  <div class="grid grid-cols-2 gap-4">
    <form-item :name="['info', 'sms', 'brandname']" label="Brandname" required>
      <a-input :value="sms.brandname" @change="onChange({ 'sms.brandname': $event.target.value })" />
    </form-item>
  </div>

  <form-item :name="['info', 'sms', 'access_token']" label="Access Token" required>
    <text-area :value="sms.access_token" @change="onChange({ 'sms.access_token': $event.target.value })" />
  </form-item>
</template>

<script>
export default {
  name: 'AddEditSenderInfobipSms',
}
</script>

<script setup>
import FormItem from '@/components/Form/Item'
import { computed } from 'vue'
import { setMany } from '@/utils/collection'
import TextArea from '@/components/TextArea'

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:info'])

const sms = computed(() => props.info.sms ?? {})

const onChange = values => {
  emit('update:info', setMany(props.info, values))
}
</script>
