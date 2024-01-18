<template>
  <drawer-view :title="'Xem chi tiết ' + Message.name" :item="itemState" :loading="loading" :width="992">
    <div class="flex flex-col divide-y py-4">
      <view-item title="ID" text-class="font-mono">{{ itemState.id }}</view-item>
      <view-item title="Thời gian dự kiến gửi">{{ format.toDatetime(itemState.schedule_send_at) }}</view-item>
      <view-item title="Số điện thoại">
        <data-phone :phone="itemState.phone" />
      </view-item>
      <view-item title="Kiểu gửi">
        <data-send-props
          :data="itemState.send_modes"
          :sent-times="itemState.sent_modes.length"
          :is-success="itemState.successful"
          is-send-mode
        />
      </view-item>
      <view-item title="Người gửi tin">
        <data-send-props
          :data="itemState.senders"
          :sent-times="itemState.sent_modes.length"
          :is-success="itemState.successful"
        />
      </view-item>
      <view-item title="Mẫu tin">
        <data-send-props
          :data="itemState.templates"
          :sent-times="itemState.sent_modes.length"
          :is-success="itemState.successful"
        />
      </view-item>

      <view-item title="Người thêm">
        <template v-if="itemState.created_user">
          {{ itemState.created_user?.name }} (IP: {{ itemState.created_ip }})
        </template>
      </view-item>
      <view-item title="Người thêm">{{ itemState.created_user?.name }}</view-item>
      <view-item title="Ngày thêm">{{ format.toDatetime(itemState.created_at) }}</view-item>
      <view-item title="Cập nhật lần cuối">{{ format.toDatetime(itemState.updated_at) }}</view-item>
    </div>
  </drawer-view>
</template>

<script>
export default {
  name: 'ViewPlanMessage',
}
</script>

<script setup>
import DrawerView from '@/components/Drawer/View'
import { computed, reactive, ref, useAttrs, watch } from 'vue'
import { toggleState } from '@/utils/toggle'
import { useStore } from 'vuex'
import notice from '@/utils/notice'
import _ from 'lodash'
import ViewItem from '@/components/Page/View/Item'
import format from '@/utils/format'
import Message from '@/models/Message'
import { SendMode } from '@/utils/enums'
import DataPhone from '@/components/Page/Data/Phone'
import ViewMessageZms from '@/components/Page/View/Message/ZMS'
import ViewMessageZns from '@/components/Page/View/Message/ZNS'
import ViewMessageSms from '@/components/Page/View/Message/SMS'
import DataSendProps from '@/components/Page/Data/SendProps'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const attrs = useAttrs()
const store = useStore()

const loading = ref(false)
const itemState = reactive(new Message())

const successful = computed(() => itemState.successful)
computed(() => {
  if (!successful.value) {
    return null
  }
  const successfulSentMode = _.last(itemState.sent_modes)
  return _.find(itemState.templates, ['send_mode', successfulSentMode])
})
const successfulMessageProps = computed(() => {
  return successful.value ? _.last(itemState.sent_histories) : {}
})
computed(() => {
  const mapping = {
    [SendMode.ZMS]: ViewMessageZms,
    [SendMode.ZNS]: ViewMessageZns,
    [SendMode.SMS]: ViewMessageSms,
  }
  return mapping[successfulMessageProps.value?.send_mode]
})
const fetchItem = () => {
  itemState.fill(props.item)

  return store
    .dispatch('message/DETAIL', itemState)
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
          store.dispatch('dropdown/LIST', { objects: ['message.send_mode'] }),
        ])
      }, loading)
    }
  },
)
</script>
