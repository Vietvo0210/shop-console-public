<template>
  <div class="flex flex-col gap-y-4">
    <form-search ref="formRef" :model="searchState">
      <form-item label="Thời gian gửi">
        <date-picker-range
          v-model:from="searchState.sent_from"
          v-model:to="searchState.sent_to"
          show-time
          :show-second="false"
          :allow-clear="false"
          :max-duration="[MESSAGE_MAX_DURATION, 'month']"
        />
      </form-item>

      <form-item label="Số điện thoại">
        <a-input v-model:value="searchState.phone" allow-clear />
      </form-item>

      <form-item label="Kiểu gửi">
        <pulldown-dynamic
          ref="sendModesRef"
          object="message.send_mode"
          v-model:value="searchState.send_modes"
          mode="multiple"
        />
      </form-item>

      <template #detail>
        <form-item label="Người gửi tin">
          <pulldown-dynamic
            ref="senderCodesRef"
            object="sender"
            v-model:value="searchState.sender_codes"
            :conditions="{ send_modes: searchState.send_modes }"
            :belongs-with-conditions="false"
            mode="multiple"
            with-code
          />
        </form-item>

        <form-item label="Mẫu tin">
          <pulldown-dynamic
            ref="templateCodesRef"
            object="template"
            v-model:value="searchState.template_codes"
            :conditions="{ send_modes: searchState.send_modes }"
            :belongs-with-conditions="false"
            mode="multiple"
            with-code
          />
        </form-item>

        <form-item label="Gửi hàng loạt">
          <pulldown-dynamic
            ref="broadcastIdsRef"
            object="broadcast"
            v-model:value="searchState.broadcast_ids"
            mode="multiple"
            with-code
          />
        </form-item>

        <form-item label="Tập người nhận tin">
          <pulldown-dynamic
            ref="reCollectionIdsRef"
            object="recipient_collection"
            v-model:value="searchState.recipient_collection_ids"
            mode="multiple"
            with-code
          />
        </form-item>

        <form-item label="Thời gian nhận">
          <filter-date-range v-model:from="searchState.received_from" v-model:to="searchState.received_to" />
        </form-item>

        <form-item label="Thời gian xem">
          <filter-date-range v-model:from="searchState.seen_from" v-model:to="searchState.seen_to" />
        </form-item>

        <form-item label="Kết quả">
          <pulldown :options="convert2DropdownOptions(MessageResultEnum)" v-model:value="searchState.successful" />
        </form-item>

        <form-item label="Mã lỗi">
          <pulldown v-model:value="searchState.errors" mode="tags" placeholder="Vui lòng nhập" />
        </form-item>

        <form-item label="Tracking">
          <a-input v-model:value="searchState.tracking" allow-clear />
        </form-item>

        <form-item label="Tài khoản">
          <pulldown-dynamic
            ref="createdIdsRef"
            object="user"
            v-model:value="searchState.created_ids"
            mode="multiple"
            with-code="username"
          />
        </form-item>
      </template>
    </form-search>

    <div class="flex items-center">
      <div class="flex-auto">
        <h2 class="inline-block font-bold text-base text-indigo-500 mb-0">Danh sách {{ Message.name }} đã gửi</h2>
      </div>
      <div class="flex-none flex justify-end gap-x-2">
        <btn-download
          v-if="notEmpty(list.messages)"
          :loading="downloading[DownloadType.RECIPIENT]"
          text="Xuất tập người nhận"
          @click="onExport(DownloadType.RECIPIENT)"
        />
        <btn-download
          v-if="notEmpty(list.messages)"
          :loading="downloading[DownloadType.MESSAGE]"
          text="Xuất tin nhắn"
          @click="onExport(DownloadType.MESSAGE)"
        />
      </div>
    </div>

    <tbl-list :list="list" list-key="messages" :loading="loading" sticky @change="formRef?.paginate">
      <tbl-col
        title="Thời gian gửi"
        data-index="sent_at"
        :sorter="true"
        default-sort-order="descend"
        :width="160"
        fixed="left"
        :custom-render="({ value }) => format.toDatetime(value)"
      />
      <tbl-col title="Số điện thoại" data-index="phone" :width="150" fixed="left">
        <template #default="{ value }">
          <data-phone :phone="value" />
        </template>
      </tbl-col>
      <tbl-col title="Kiểu gửi" data-index="send_modes" :width="150">
        <template #default="{ record, value }">
          <data-send-props
            :data="value"
            :sent-times="record.sent_modes.length"
            :is-success="record.successful"
            is-send-mode
          />
        </template>
      </tbl-col>
      <tbl-col title="Người gửi tin" data-index="senders" :width="150">
        <template #default="{ record, value }">
          <data-send-props :data="value" :sent-times="record.sent_modes.length" :is-success="record.successful" />
        </template>
      </tbl-col>
      <tbl-col title="Mẫu tin" data-index="templates" :width="150">
        <template #default="{ record, value }">
          <data-send-props :data="value" :sent-times="record.sent_modes.length" :is-success="record.successful" />
        </template>
      </tbl-col>
      <tbl-col title="Kết quả" :width="200">
        <template #default="{ record }">
          <data-message-result :message="record" />
        </template>
      </tbl-col>
      <tbl-col
        title="Thời gian nhận"
        data-index="received_at"
        :sorter="true"
        :width="160"
        :custom-render="({ value }) => format.toDatetime(value)"
      />
      <tbl-col
        title="Thời gian xem"
        data-index="seen_at"
        :sorter="true"
        :width="160"
        :custom-render="({ value }) => format.toDatetime(value)"
      />
      <tbl-col title="Tài khoản" data-index="created_user" :width="200">
        <template #default="{ value }">
          <data-code-name :model="value" code-field="username" />
        </template>
      </tbl-col>
      <tbl-col title="Hành động" align="center" :width="100" fixed="right">
        <template #default="{ record }">
          <div class="flex justify-center gap-2">
            <btn-view only-icon tooltip="Xem" @click="onView(record)" />
            <btn-send only-icon tooltip="Gửi lại" @click="onResend(record)" />
          </div>
        </template>
      </tbl-col>
    </tbl-list>

    <view-message v-model:visible="drawers.view.visible" :item="selectedItem" />
  </div>
</template>

<script setup>
import FormSearch from '@/components/Form/Search'
import FormItem from '@/components/Form/Item'
import { computed, h, onMounted, reactive, ref, watch } from 'vue'
import qs from 'qs'
import { useRoute, useRouter } from 'vue-router'
import format from '@/utils/format'
import { watchSearchForm } from '@/utils/form'
import PulldownDynamic from '@/components/Pulldown/Dynamic'
import { convert2DropdownOptions, fetchDropdowns } from '@/utils/dropdown'
import TblList from '@/components/Table/List'
import { useStore } from 'vuex'
import { toggleState } from '@/utils/toggle'
import notice from '@/utils/notice'
import Message from '@/models/Message'
import BtnView from '@/components/Button/View'
import ViewMessage from '@/components/Page/View/Message'
import DataPhone from '@/components/Page/Data/Phone'
import DataMessageResult from '@/components/Page/Data/MessageResult'
import TblCol from '@/components/Table/Column'
import cast from '@/utils/cast'
import Pulldown from '@/components/Pulldown'
import { DownloadType, MessageResultEnum } from '@/utils/enums'
import BtnDownload from '@/components/Button/Download'
import { blank, notEmpty } from '@/utils/variable'
import DataSendProps from '@/components/Page/Data/SendProps'
import FilterDateRange from '@/components/Form/Search/Filter/DateRange'
import { showConfirm } from '@/utils/confirm'
import { WarningOutlined } from '@ant-design/icons-vue'
import BtnSend from '@/components/Button/Send'
import DatePickerRange from '@/components/DatePicker/Range'
import dayjs from 'dayjs'
import { DATE_FORMAT } from '@/utils/consts'
import DataCodeName from '@/components/Page/Data/CodeName'

const MESSAGE_MAX_DURATION = 3

const route = useRoute()
const router = useRouter()
const store = useStore()

const formRef = ref(null)
const loading = ref(false)
const downloading = reactive({
  [DownloadType.RECIPIENT]: false,
  [DownloadType.MESSAGE]: false,
})
const sendModesRef = ref(null)
const senderCodesRef = ref(null)
const templateCodesRef = ref(null)
const broadcastIdsRef = ref(null)
const reCollectionIdsRef = ref(null)
const createdIdsRef = ref(null)

const drawers = reactive({
  view: {
    visible: false,
  },
})
const selectedItem = ref(null)

const list = computed(() => store.getters['message/getList'])

const searchState = reactive({})
const updateState = () => {
  const queries = qs.parse(route.query)
  Object.assign(searchState, {
    sent_from: queries.sent_from,
    sent_to: queries.sent_to,
    phone: queries.phone,
    sender_codes: cast.toArray(queries.sender_codes),
    send_modes: cast.toArrayAsType(queries.send_modes, Number),
    template_codes: cast.toArray(queries.template_codes),
    broadcast_ids: cast.toArrayAsType(queries.broadcast_ids, Number),
    recipient_collection_ids: cast.toArrayAsType(queries.recipient_collection_ids, Number),
    received_from: queries.received_from,
    received_to: queries.received_to,
    seen_from: queries.seen_from,
    seen_to: queries.seen_to,
    successful: queries.successful,
    errors: cast.toArrayAsType(queries.errors, Number),
    tracking: queries.tracking,
    created_ids: cast.toArrayAsType(queries.created_ids, Number),
  })
}

const fetchItems = () => {
  return toggleState(() => {
    return store.dispatch('message/LIST_PAGE', route.query).catch(notice.error)
  }, loading)
}

const replaceFilterSentAt = () => {
  const queries = qs.parse(route.query)

  let change = false
  if (blank(queries.sent_to)) {
    change = true
    queries.sent_to = dayjs().format(DATE_FORMAT + ' 23:59:59')
  }
  if (blank(queries.sent_from)) {
    queries.sent_from = cast
      .toDayjs(queries.sent_to)
      .subtract(6, 'day')
      .format(DATE_FORMAT + ' 00:00:00')
    change = true
  }

  if (change) {
    const queryString = qs.stringify(queries, { encode: false })
    router.replace(route.path + '?' + queryString)
  }

  return change
}

watchSearchForm(updateState, { immediate: true })
watchSearchForm(() => {
  if (!replaceFilterSentAt()) {
    fetchItems()
  }
})

const onView = item => {
  selectedItem.value = item
  drawers.view.visible = true
}

const onResend = item => {
  showConfirm({
    title: h('b', 'Xác nhận gửi lại tin nhắn'),
    icon: h(WarningOutlined, { class: 'text-indigo-500' }),
    content: h('p', 'Bạn có chắc chắn muốn gửi lại không?'),
    okText: 'Gửi lại',
    onOk() {
      toggleState(() => {
        return store
          .dispatch('message/RESEND', item)
          .then(response => {
            notice.success(response.message)
            fetchItems()
          })
          .catch(notice.error)
      }, loading)
    },
  })
}

const onExport = type => {
  toggleState(
    () => {
      const payload = {
        type,
        conditions: qs.parse(route.query),
      }
      return store
        .dispatch('download/CREATE', payload)
        .then(response => {
          notice.success(response.message)
          router.push('/downloads')
        })
        .catch(notice.error)
    },
    downloading,
    type,
  )
}

watch(
  () => senderCodesRef.value,
  () => {
    fetchDropdowns([
      senderCodesRef.value,
      templateCodesRef.value,
      broadcastIdsRef.value,
      reCollectionIdsRef.value,
      createdIdsRef.value,
    ])
  },
)

watch(
  () => searchState.send_modes,
  () => {
    fetchDropdowns([
      senderCodesRef.value,
      templateCodesRef.value,
    ])
  },
)

onMounted(() => {
  const promises = [fetchDropdowns(sendModesRef.value)]
  if (!replaceFilterSentAt()) {
    promises.push(fetchItems())
  }
  Promise.all(promises)
})
</script>
