<template>
  <div class="flex flex-col divide-y py-4">
    <view-item title="Brandname" text-class="font-mono">{{ sms.brandname }}</view-item>
    <view-item title="Access Token" text-class="font-mono text-xs break-all">{{ sms.access_token }}</view-item>
  </div>
</template>

<script>
export default {
  name: 'ViewSenderPlatformInfobipSms',
}
</script>

<script setup>
import ViewItem from '@/components/Page/View/Item'
import { computed } from 'vue'

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
})

const sms = computed(() => props.info.sms ?? {})
</script>
