<template>
  <a-divider orientation="left" class="mb-2">
    <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
      <icon-fe type="settings" />
      Lịch sử gửi tin
    </div>
  </a-divider>

  <tbl :data-source="sentHistories" :pagination="false" sticky>
    <tbl-col title="Số thứ tự" :width="80" fixed="left" align="center">
      <template #default="{ index }">
        <a-badge :count="index + 1" :number-style="{ background: '#6366f1' }" />
      </template>
    </tbl-col>
    <tbl-col title="Thời gian gửi" :width="320">
      <template #default="{ record }">
        <p class="mb-0">{{ format.toDatetime(record.sent_from) }} → {{ format.toDatetime(record.sent_to) }}</p>
        <small class="text-slate-500">
          Quá trình gửi mất:
          <b>{{ getSentDuration(record.sent_from, record.sent_to) }}</b>
        </small>
      </template>
    </tbl-col>
    <tbl-col title="Trạng thái" data-index="status" :width="150">
      <template #default="{ record }">
        <data-broadcast-status :broadcast="record" />
      </template>
    </tbl-col>
    <tbl-col
      title="Số tin đã gửi"
      data-index="total"
      :width="150"
      :custom-render="({ value }) => format.toNumber(value)"
    />
  </tbl>
</template>

<script>
export default {
  name: 'ViewBroadcastSentHistories',
}
</script>

<script setup>
import format from '@/utils/format'
import DataBroadcastStatus from '@/components/Page/Data/BroadcastStatus'
import Tbl from '@/components/Table'
import IconFe from '@/components/Icon/Fe'
import TblCol from '@/components/Table/Column'
import '@/components/Page/View/Broadcast/SentHistories'
import cast from '@/utils/cast'

const props = defineProps({
  sentHistories: {
    type: Object,
    default: () => ({}),
  },
})

const getSentDuration = (from, to) => {
  const diff = cast.toDayjs(to).diff(cast.toDayjs(from))
  return format.toDuration(diff)
}
</script>
