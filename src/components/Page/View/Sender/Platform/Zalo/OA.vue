<template>
  <div class="flex flex-col divide-y py-4">
    <view-item title="App ID" text-class="font-mono">{{ app.id }}</view-item>
    <view-item title="App Secret Key" text-class="font-mono">{{ app.secret_key }}</view-item>
    <view-item title="OA ID" text-class="font-mono">{{ oa.id }}</view-item>
    <view-item title="OA Secret Key" text-class="font-mono">{{ oa.secret_key }}</view-item>
    <view-item title="OA Access Token">
      <p class="font-mono text-xs break-all mb-1">{{ oa.access_token }}</p>
      <p v-if="notBlank(oa.access_token_exp)" class="flex items-center gap-x-1 text-slate-500 mb-0">
        <icon-fe type="clock" :size="12" />
        <small>Có hiệu lực đến: <b>{{ format.toDatetime(oa.access_token_exp) }}</b></small>
      </p>
    </view-item>
    <view-item title="OA Refresh Token" text-class="font-mono text-xs break-all">{{ oa.refresh_token }}</view-item>
  </div>
</template>

<script>
export default {
  name: 'ViewSenderPlatformZaloOa',
}
</script>

<script setup>
import ViewItem from '@/components/Page/View/Item'
import { computed } from 'vue'
import format from '@/utils/format'
import IconFe from '@/components/Icon/Fe'
import { notBlank } from '@/utils/variable'

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
})

const app = computed(() => props.info.app ?? {})
const oa = computed(() => props.info.oa ?? {})
</script>
