<template>
  <div class="flex flex-col gap-y-4">
    <form-search ref="formRef" :model="searchState">
      <form-item label="Thời gian dự kiến gửi">
        <date-picker-range
          v-model:from="searchState.schedule_send_from"
          v-model:to="searchState.schedule_send_to"
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

        <form-item label="Tracking">
          <a-input v-model:value="searchState.tracking" allow-clear />
        </form-item>

        <form-item label="Thời gian">
          <filter-date-range v-model:from="searchState.created_from" v-model:to="searchState.created_to" />
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
        <h2 class="inline-block font-bold text-base text-indigo-500 mb-0">Danh sách {{ Message.name }} dự kiến</h2>
      </div>
    </div>

    <tbl-list :list="list" list-key="plan_messages" :loading="loading" sticky @change="formRef?.paginate">
      <tbl-col
        title="Thời gian dự kiến gửi"
        data-index="schedule_send_at"
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
      <tbl-col
        title="Thời gian"
        data-index="created_at"
        :sorter="true"
        :width="180"
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
            <btn-cancel theme="danger" tooltip="Hủy" only-icon @click="onCancel(record)" />
          </div>
        </template>
      </tbl-col>
    </tbl-list>

    <view-plan-message v-model:visible="drawers.view.visible" :item="selectedItem" />
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
import { fetchDropdowns } from '@/utils/dropdown'
import TblList from '@/components/Table/List'
import { useStore } from 'vuex'
import { toggleState } from '@/utils/toggle'
import notice from '@/utils/notice'
import Message from '@/models/Message'
import BtnView from '@/components/Button/View'
import DataPhone from '@/components/Page/Data/Phone'
import TblCol from '@/components/Table/Column'
import cast from '@/utils/cast'
import DataSendProps from '@/components/Page/Data/SendProps'
import DataCodeName from '@/components/Page/Data/CodeName'
import BtnCancel from '@/components/Button/Cancel'
import DatePickerRange from '@/components/DatePicker/Range'
import Template from '@/models/Template'
import FilterDateRange from '@/components/Form/Search/Filter/DateRange'
import ViewPlanMessage from '@/components/Page/View/PlanMessage'
import { blank } from '@/utils/variable'
import { DATE_FORMAT } from '@/utils/consts'
import dayjs from 'dayjs'
import { showConfirm } from '@/utils/confirm'
import { WarningOutlined } from '@ant-design/icons-vue'

const MESSAGE_MAX_DURATION = 3

const route = useRoute()
const router = useRouter()
const store = useStore()

const formRef = ref(null)
const loading = ref(false)
const sendModesRef = ref(null)
const senderCodesRef = ref(null)
const templateCodesRef = ref(null)
const createdIdsRef = ref(null)

const drawers = reactive({
  view: {
    visible: false,
  },
})
const selectedItem = ref(null)

const list = computed(() => store.getters['planMessage/getList'])

const searchState = reactive({})
const updateState = () => {
  const queries = qs.parse(route.query)
  Object.assign(searchState, {
    schedule_send_from: queries.schedule_send_from,
    schedule_send_to: queries.schedule_send_to,
    phone: queries.phone,
    sender_codes: cast.toArray(queries.sender_codes),
    send_modes: cast.toArrayAsType(queries.send_modes, Number),
    template_codes: cast.toArray(queries.template_codes),
    tracking: queries.tracking,
    created_ids: cast.toArrayAsType(queries.created_ids, Number),
  })
}

const fetchItems = () => {
  return toggleState(() => {
    return store.dispatch('planMessage/LIST_PAGE', route.query).catch(notice.error)
  }, loading)
}

const replaceFilterScheduleSendAt = () => {
  const queries = qs.parse(route.query)

  let change = false
  if (blank(queries.schedule_send_from)) {
    change = true
    queries.schedule_send_from = dayjs().format(DATE_FORMAT + ' 00:00:00')
  }
  if (blank(queries.schedule_send_to)) {
    queries.schedule_send_to = cast
      .toDayjs(queries.schedule_send_from)
      .add(6, 'day')
      .format(DATE_FORMAT + ' 23:59:59')
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
  if (!replaceFilterScheduleSendAt()) {
    fetchItems()
  }
})

const onView = item => {
  selectedItem.value = item
  drawers.view.visible = true
}

const onCancel = item => {
  showConfirm({
    title: h('b', 'Xác nhận hủy bỏ tin nhắn dự kiến'),
    icon: h(WarningOutlined, { class: 'text-red-500' }),
    content: h('p', 'Bạn có chắc chắn muốn hủy bỏ không?'),
    okText: 'Hủy gửi',
    onOk() {
      toggleState(() => {
        return store
          .dispatch('planMessage/CANCEL', item)
          .then(response => {
            notice.success(response.message)
            fetchItems()
          })
          .catch(notice.error)
      }, loading)
    },
  })
}

watch(
  () => senderCodesRef.value,
  () => {
    fetchDropdowns([
      senderCodesRef.value,
      templateCodesRef.value,
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
  if (!replaceFilterScheduleSendAt()) {
    promises.push(fetchItems())
  }
  Promise.all(promises)
})
</script>
