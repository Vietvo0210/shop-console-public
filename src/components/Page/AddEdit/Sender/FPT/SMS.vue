<template>
  <div class="grid grid-cols-2 gap-4">
    <form-item :name="['info', 'sms', 'brandname']" label="Brandname" required>
      <a-input :value="sms.brandname" @change="onChange({ 'sms.brandname': $event.target.value })" />
    </form-item>

    <form-item :name="['info', 'sms', 'client_id']" label="Client ID" required>
      <a-input :value="sms.client_id" @change="onChange({ 'sms.client_id': $event.target.value })" />
    </form-item>
  </div>

  <form-item :name="['info', 'sms', 'client_secret']" label="Client Secret" required>
    <a-input :value="sms.client_secret" @change="onChange({ 'sms.client_secret': $event.target.value })" />
  </form-item>

  <form-item :name="['info', 'sms', 'access_token']" label="Access Token">
    <text-area :auto-size="{ minRows: 5 }" :value="sms.access_token" readonly class="bg-slate-100" />
    <div class="flex flex-col gap-y-1 text-slate-500 mt-1">
      <p v-if="notBlank(sms.access_token_exp)" class="flex items-center gap-x-1 mb-0">
        <icon-fe type="clock" :size="12" />
        <small>Có hiệu lực đến: <b>{{ format.toDatetime(sms.access_token_exp) }}</b></small>
      </p>
      <p class="flex items-center gap-x-1 mb-0">
        <icon-fe type="key" :size="12" />
        <small>Sẽ tự sinh ra khi có thao tác gửi tin</small>
      </p>
    </div>
  </form-item>
</template>

<script>
export default {
  name: 'AddEditSenderFptSms',
}
</script>

<script setup>
import format from '@/utils/format'
import FormItem from '@/components/Form/Item'
import { notBlank } from '@/utils/variable'
import { computed } from 'vue'
import IconFe from '@/components/Icon/Fe'
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
