<template>
  <div class="flex flex-col divide-y py-4">
    <view-item title="Brandname" text-class="font-mono">{{ sms.brandname }}</view-item>
    <view-item title="Client ID" text-class="font-mono">{{ sms.client_id }}</view-item>
    <view-item title="Client Secret" text-class="font-mono break-all">{{ sms.client_secret }}</view-item>
    <view-item title="Access Token">
      <p class="font-mono text-xs break-all mb-1">{{ sms.access_token }}</p>
      <div class="flex flex-col gap-y-1 text-slate-500 mt-1">
        <p v-if="notBlank(sms.access_token_exp)" class="flex items-center gap-x-1 mb-0">
          <icon-fe type="clock" :size="12" />
          <small>Có hiệu lực đến: <b>{{ format.toDatetime(sms.access_token_exp) }}</b></small>
        </p>
        <p v-if="notBlank(sms.access_token)" class="flex items-center gap-x-1 mb-0">
          <icon-fe type="key" :size="12" />
          <small>Sẽ tự sinh ra khi có thao tác gửi tin</small>
        </p>
      </div>
    </view-item>
  </div>
</template>

<script>
export default {
  name: 'ViewSenderPlatformFptSms',
}
</script>

<script setup>
import ViewItem from '@/components/Page/View/Item'
import { computed } from 'vue'
import IconFe from '@/components/Icon/Fe'
import { notBlank } from '@/utils/variable'
import format from '@/utils/format'

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
})

const sms = computed(() => props.info.sms ?? {})
</script>
