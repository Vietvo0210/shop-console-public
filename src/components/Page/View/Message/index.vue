<template>
  <drawer-view :title="'Xem chi tiết ' + Message.name" :item="itemState" :loading="loading" :width="992">
    <div class="flex flex-col divide-y py-4">
      <view-item title="ID" text-class="font-mono">{{ itemState.id }}</view-item>
      <view-item title="Thời gian gửi">{{ format.toDatetime(itemState.sent_at) }}</view-item>
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
      <view-item title="Gửi hàng loạt">
        <data-code-name :model="itemState.broadcast" name-field="title" />
      </view-item>
      <view-item title="Tập người nhận tin">
        <data-code-name :model="itemState.recipient_collection" />
      </view-item>
      <view-item title="Kết quả">
        <data-message-result :message="itemState" />
      </view-item>
      <template v-if="itemState.successful">
        <view-item title="ID tin nhắn" text-class="font-mono">{{ itemState.message_id }}</view-item>
        <view-item title="Thời gian nhận">{{ format.toDatetime(itemState.received_at) }}</view-item>
        <view-item title="Thời gian xem">{{ format.toDatetime(itemState.seen_at) }}</view-item>
      </template>

      <view-item title="Người thêm">
        <template v-if="itemState.created_user">
          {{ itemState.created_user?.name }} (IP: {{ itemState.created_ip }})
        </template>
      </view-item>
      <view-item title="Người thêm">{{ itemState.created_user?.name }}</view-item>
      <view-item title="Ngày thêm">{{ format.toDatetime(itemState.created_at) }}</view-item>
      <view-item title="Cập nhật lần cuối">{{ format.toDatetime(itemState.updated_at) }}</view-item>
    </div>

    <template v-if="successfulTemplate">
      <a-divider orientation="left" class="mb-2">
        <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
          <icon-fe type="check" />
          Tin nhắn thành công
        </div>
      </a-divider>

      <component
        :is="ViewMessageComponent"
        :template="successfulTemplate"
        :class="{ 'w-[336px]': ViewMessageComponent !== ViewMessageZns }"
        v-bind="_.mapKeys(successfulMessageProps, (v, k) => _.camelCase(k))"
      />
    </template>

    <a-divider orientation="left" class="mb-2">
      <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
        <icon-fe type="settings" />
        Lịch sử gửi tin
      </div>
    </a-divider>

    <tbl :data-source="itemState.sent_histories" :pagination="false" sticky>
      <tbl-col title="Số thứ tự" :width="80" fixed="left" align="center">
        <template #default="{ index }">
          <a-badge :count="index + 1" :number-style="{ background: '#6366f1' }" />
        </template>
      </tbl-col>
      <tbl-col
        title="Thời gian gửi"
        data-index="sent_at"
        :width="160"
        fixed="left"
        :custom-render="({ value }) => format.toDatetime(value)"
      />
      <tbl-col title="Kiểu gửi" data-index="send_mode" :width="100">
        <template #default="{ value, index }">
          <tag :color="ColorRange[index]">{{ getDropdownProp(enumMessageSendMode, value) }}</tag>
        </template>
      </tbl-col>
      <tbl-col title="Người gửi tin" data-index="sender_code" :width="100">
        <template #default="{ value, index }">
          <tag :color="ColorRange[index]">{{ value }}</tag>
        </template>
      </tbl-col>
      <tbl-col title="Mẫu tin" data-index="template_code" :width="100">
        <template #default="{ value, index }">
          <tag :color="ColorRange[index]">{{ value }}</tag>
        </template>
      </tbl-col>
      <tbl-col title="Kết quả" data-index="error" :width="200">
        <template #default="{ record }">
          <data-message-result :message="record" />
        </template>
      </tbl-col>
      <tbl-col title="Hành động" align="center" :width="100" fixed="right">
        <template #default="{ index }">
          <div class="flex justify-center gap-2">
            <btn-view only-icon icon="message-square" tooltip="Xem tin nhắn" @click="onViewMessage(index)" />
          </div>
        </template>
      </tbl-col>
    </tbl>

    <modal-view-message
      v-model:visible="modals.viewMessage.visible"
      :template="selectedTemplate"
      :message-props="selectedMessageProps"
    />
  </drawer-view>
</template>

<script>
export default {
  name: 'ViewMessage',
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
import { getDropdownProp } from '@/utils/dropdown'
import format from '@/utils/format'
import Message from '@/models/Message'
import Tag from '@/components/Tag'
import IconFe from '@/components/Icon/Fe'
import { ColorRange, SendMode } from '@/utils/enums'
import DataPhone from '@/components/Page/Data/Phone'
import DataMessageResult from '@/components/Page/Data/MessageResult'
import Tbl from '@/components/Table'
import TblCol from '@/components/Table/Column'
import BtnView from '@/components/Button/View'
import ModalViewMessage from '@/components/Modal/View/Message'
import ViewMessageZms from '@/components/Page/View/Message/ZMS'
import ViewMessageZns from '@/components/Page/View/Message/ZNS'
import ViewMessageSms from '@/components/Page/View/Message/SMS'
import DataSendProps from '@/components/Page/Data/SendProps'
import DataCodeName from '@/components/Page/Data/CodeName'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const attrs = useAttrs()
const store = useStore()

const modals = reactive({
  viewMessage: {
    visible: false,
  },
})
const loading = ref(false)
const itemState = reactive(new Message())
const selectedTemplate = ref(null)
const selectedMessageProps = ref({})

const enumMessageSendMode = computed(() => store.getters['dropdown/getEnum']('message.send_mode'))

const successful = computed(() => itemState.successful)
const successfulTemplate = computed(() => {
  if (!successful.value) {
    return null
  }
  const successfulSentMode = _.last(itemState.sent_modes)
  return _.find(itemState.templates, ['send_mode', successfulSentMode])
})
const successfulMessageProps = computed(() => {
  return successful.value ? _.last(itemState.sent_histories) : {}
})
const ViewMessageComponent = computed(() => {
  const mapping = {
    [SendMode.ZMS]: ViewMessageZms,
    [SendMode.ZNS]: ViewMessageZns,
    [SendMode.SMS]: ViewMessageSms,
  }
  return mapping[successfulMessageProps.value?.send_mode]
})

const onViewMessage = index => {
  selectedTemplate.value = itemState.templates[index] ?? null
  selectedMessageProps.value = itemState.sent_histories[index] ?? null
  modals.viewMessage.visible = true
}

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
