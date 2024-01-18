<template>
  <drawer-view :title="'Xem chi tiết ' + Broadcast.name" :item="itemState" :loading="loading">
    <div class="flex flex-col divide-y py-4">
      <view-item title="ID">{{ itemState.id }}</view-item>
      <view-item title="Mã">
        <tag theme="primary">{{ itemState.code }}</tag>
      </view-item>
      <view-item title="Tiêu đề">{{ itemState.title }}</view-item>
      <view-item title="Kiểu gửi">
        <data-send-props :data="itemState.send_modes" is-send-mode />
      </view-item>
      <view-item title="Người gửi tin">
        <data-send-props :data="itemState.senders" />
      </view-item>
      <view-item title="Mẫu tin">
        <data-send-props :data="itemState.templates" />
      </view-item>
      <view-item title="Tập người nhận tin">
        <data-code-name :model="itemState.recipient_collection" />
      </view-item>
      <view-item title="Trạng thái">
        <data-broadcast-status :broadcast="itemState" />
      </view-item>
      <view-item title="Thời gian gửi dự kiến">{{ format.toDatetime(itemState.schedule_send_at) }}</view-item>
      <view-item v-if="notBlank(itemState.sent_from)" title="Thời gian gửi">
        <p class="mb-0">{{ format.toDatetime(itemState.sent_from) }} → {{ format.toDatetime(itemState.sent_to) }}</p>
        <small class="text-slate-500">Quá trình gửi mất: <b>{{ sentDuration }}</b></small>
      </view-item>
      <view-item title="Loại gửi">
        <data-enum enum="broadcast.type" :value="itemState.type" />
      </view-item>
      <view-item title="Tổng số tin nhắn">{{ format.toNumber(itemState.total) }}</view-item>
      <view-item title="Tổng số chi tiết">
        <div class="flex flex-col divide-y">
          <view-item title="Tổng cộng">{{ format.toNumber(itemState.total_detail?.total) }}</view-item>
          <view-item title="Thành công">{{ format.toNumber(itemState.total_detail?.sent_successful) }}</view-item>
          <view-item title="Đã nhận">{{ format.toNumber(itemState.total_detail?.received) }}</view-item>
          <view-item title="Đã xem">{{ format.toNumber(itemState.total_detail?.seen) }}</view-item>
          <view-item title="Thất bại">{{ format.toNumber(itemState.total_detail?.sent_failed) }}</view-item>
        </div>
      </view-item>

      <view-item title="Người thêm">
        <template v-if="itemState.created_user">
          {{ itemState.created_user?.name }} (IP: {{ itemState.created_ip }})
        </template>
      </view-item>
      <view-item title="Ngày thêm">{{ format.toDatetime(itemState.created_at) }}</view-item>
      <view-item title="Cập nhật lần cuối">{{ format.toDatetime(itemState.updated_at) }}</view-item>
    </div>

    <view-sent-histories :sent-histories="itemState.sent_histories" />
  </drawer-view>
</template>

<script>
export default {
  name: 'ViewBroadcast',
}
</script>

<script setup>
import DrawerView from '@/components/Drawer/View'
import { computed, reactive, ref, useAttrs, watch } from 'vue'
import { toggleState } from '@/utils/toggle'
import { useStore } from 'vuex'
import notice from '@/utils/notice'
import ViewItem from '@/components/Page/View/Item'
import format from '@/utils/format'
import Broadcast from '@/models/Broadcast'
import Tag from '@/components/Tag'
import DataEnum from '@/components/Page/Data/Enum'
import DataSendProps from '@/components/Page/Data/SendProps'
import DataCodeName from '@/components/Page/Data/CodeName'
import { notBlank } from '@/utils/variable'
import cast from '@/utils/cast'
import DataBroadcastStatus from '@/components/Page/Data/BroadcastStatus'
import ViewSentHistories from '@/components/Page/View/Broadcast/SentHistories'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const attrs = useAttrs()
const store = useStore()

const loading = ref(false)
const itemState = reactive(new Broadcast())

const diffDates = (from, to) => {
  return cast.toDayjs(to).diff(cast.toDayjs(from))
}

const sentDuration = computed(() => {
  const diff = itemState.sent_histories?.reduce((duration, history) => {
    return duration + diffDates(history.sent_from, history.sent_to)
  }, 0)
  return format.toDuration(diff)
})

const fetchItem = () => {
  itemState.fill(props.item)

  return store
    .dispatch('broadcast/DETAIL', itemState.id)
    .then(item => itemState.fill(item))
    .catch(notice.error)
}

watch(
  () => attrs.visible,
  visible => {
    if (visible) {
      toggleState(() => {
        return Promise.all([
          fetchItem(),
          store.dispatch('dropdown/LIST', {
            objects: [
              'message.send_mode',
              'broadcast.status',
              'broadcast.type',
            ],
          }),
        ])
      }, loading)
    }
  },
)
</script>
