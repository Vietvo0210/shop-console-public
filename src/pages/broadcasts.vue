<template>
  <div class="flex flex-col gap-y-4">
    <form-search ref="formRef" :model="searchState">
      <form-item label="Từ khóa">
        <a-input v-model:value="searchState.keyword" placeholder="Tìm theo ID, mã, tiêu đề, ..." allow-clear />
      </form-item>

      <form-item label="Kiểu gửi">
        <pulldown-dynamic
          ref="sendModesRef"
          object="message.send_mode"
          v-model:value="searchState.send_modes"
          mode="multiple"
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

      <template #detail>
        <form-item label="Tập người nhận tin">
          <pulldown-dynamic
            ref="reCollectionIdsRef"
            object="recipient_collection"
            v-model:value="searchState.recipient_collection_ids"
            mode="multiple"
            with-code
          />
        </form-item>

        <form-item label="Trạng thái">
          <pulldown-dynamic
            ref="statusesRef"
            object="broadcast.status"
            v-model:value="searchState.statuses"
            mode="multiple"
          />
        </form-item>

        <form-item label="Loại gửi">
          <pulldown-dynamic ref="typesRef" object="broadcast.type" v-model:value="searchState.types" mode="multiple" />
        </form-item>

        <form-item label="Thời gian gửi">
          <filter-date-range v-model:from="searchState.schedule_send_from" v-model:to="searchState.schedule_send_to" />
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
        <h2 class="inline-block font-bold text-base text-indigo-500 mb-0">Danh sách {{ Broadcast.name }}</h2>
      </div>
      <div class="flex-none flex justify-end gap-x-2">
        <btn-send text="Gửi hàng loạt" @click="onAddEdit()" />
      </div>
    </div>

    <tbl-list :list="list" list-key="broadcasts" :loading="loading" sticky @change="formRef?.paginate">
      <tbl-col title="ID" data-index="id" :sorter="true" default-sort-order="descend" :width="80" fixed="left" />
      <tbl-col title="Mã" data-index="code" :width="150" fixed="left">
        <template #default="{ value }">
          <tag theme="primary">{{ value }}</tag>
        </template>
      </tbl-col>
      <tbl-col title="Tiêu đề" data-index="title" :width="300" fixed="left" />
      <tbl-col title="Kiểu gửi" data-index="send_modes" :width="150">
        <template #default="{ value }">
          <data-send-props :data="value" is-send-mode />
        </template>
      </tbl-col>
      <tbl-col title="Người gửi tin" data-index="senders" :width="150">
        <template #default="{ value }">
          <data-send-props :data="value" />
        </template>
      </tbl-col>
      <tbl-col title="Mẫu tin" data-index="templates" :width="150">
        <template #default="{ value }">
          <data-send-props :data="value" />
        </template>
      </tbl-col>
      <tbl-col title="Tập người nhận tin" data-index="recipient_collection" :width="300">
        <template #default="{ value }">
          <data-code-name :model="value" />
        </template>
      </tbl-col>
      <tbl-col title="Trạng thái" data-index="status" :width="200">
        <template #default="{ record }">
          <data-broadcast-status :broadcast="record" />
        </template>
      </tbl-col>
      <tbl-col title="Thời gian gửi dự kiến" data-index="schedule_send_at" :sorter="true" :width="180" />
      <tbl-col title="Thời gian gửi" data-index="sent_from" :sorter="true" :width="340">
        <template #default="{ record }">
          <template v-if="notBlank(record.sent_from)">
            {{ format.toDatetime(record.sent_from) }} → {{ format.toDatetime(record.sent_to) }}
          </template>
        </template>
      </tbl-col>
      <tbl-col title="Loại gửi" data-index="type" :width="200">
        <template #default="{ value }">
          <data-enum enum="broadcast.type" :value="value" />
        </template>
      </tbl-col>
      <tbl-col
        title="Tổng số tin nhắn"
        data-index="total"
        :sorter="true"
        :width="160"
        :custom-render="({ value }) => format.toNumber(value)"
      />
      <tbl-col title="Tài khoản" data-index="created_user" :width="200">
        <template #default="{ value }">
          <data-code-name :model="value" code-field="username" />
        </template>
      </tbl-col>
      <tbl-col title="Hành động" align="center" :width="150" fixed="right">
        <template #default="{ record }">
          <div class="flex justify-center gap-2">
            <btn-view only-icon tooltip="Xem" @click="onView(record)" />
            <btn-copy
              v-if="record.type === BroadcastType.PROACTIVE"
              only-icon
              tooltip="Sao chép"
              @click="onCopy(record)"
            />
            <btn-cancel
              v-if="record.status === BroadcastStatus.WAITING"
              theme="danger"
              tooltip="Hủy"
              only-icon
              @click="onCancel(record)"
            />
            <btn-send
              v-if="record.status === BroadcastStatus.ERROR"
              icon="play"
              tooltip="Tiếp tục gửi"
              only-icon
              @click="onResend(record)"
            />
          </div>
        </template>
      </tbl-col>
    </tbl-list>

    <view-broadcast v-model:visible="drawers.view.visible" :item="selectedItem" />
    <add-edit-broadcast v-model:visible="drawers.addEdit.visible" :item="selectedItem" @ok="onAddEditOk" />
  </div>
</template>

<script setup>
import FormSearch from '@/components/Form/Search'
import FormItem from '@/components/Form/Item'
import { computed, h, onMounted, reactive, ref, watch } from 'vue'
import qs from 'qs'
import { useRoute } from 'vue-router'
import cast from '@/utils/cast'
import { watchSearchForm } from '@/utils/form'
import PulldownDynamic from '@/components/Pulldown/Dynamic'
import { fetchDropdowns } from '@/utils/dropdown'
import TblList from '@/components/Table/List'
import { useStore } from 'vuex'
import { toggleState } from '@/utils/toggle'
import notice from '@/utils/notice'
import format from '@/utils/format'
import { BroadcastStatus, BroadcastType } from '@/utils/enums'
import BtnView from '@/components/Button/View'
import Broadcast from '@/models/Broadcast'
import ViewBroadcast from '@/components/Page/View/Broadcast'
import AddEditBroadcast from '@/components/Page/AddEdit/Broadcast'
import Tag from '@/components/Tag'
import TblCol from '@/components/Table/Column'
import DataSendProps from '@/components/Page/Data/SendProps'
import DataCodeName from '@/components/Page/Data/CodeName'
import FilterDateRange from '@/components/Form/Search/Filter/DateRange'
import BtnCopy from '@/components/Button/Copy'
import BtnSend from '@/components/Button/Send'
import BtnCancel from '@/components/Button/Cancel'
import { showConfirm } from '@/utils/confirm'
import { WarningOutlined } from '@ant-design/icons-vue'
import { notBlank } from '@/utils/variable'
import DataEnum from '@/components/Page/Data/Enum'
import DataBroadcastStatus from '@/components/Page/Data/BroadcastStatus'

const route = useRoute()
const store = useStore()

const formRef = ref(null)
const loading = ref(false)

const drawers = reactive({
  view: {
    visible: false,
  },
  addEdit: {
    visible: false,
  },
})
const selectedItem = ref(null)
const sendModesRef = ref(null)
const templateCodesRef = ref(null)
const statusesRef = ref(null)
const typesRef = ref(null)
const reCollectionIdsRef = ref(null)
const createdIdsRef = ref(null)

const list = computed(() => store.getters['broadcast/getList'])

const searchState = reactive({})
const updateState = () => {
  const queries = qs.parse(route.query)
  Object.assign(searchState, {
    keyword: queries.keyword,
    send_modes: cast.toArrayAsType(queries.send_modes, Number),
    template_codes: cast.toArray(queries.template_codes),
    recipient_collection_ids: cast.toArrayAsType(queries.recipient_collection_ids, Number),
    statuses: cast.toArrayAsType(queries.statuses, Number),
    types: cast.toArrayAsType(queries.types, Number),
    schedule_send_from: queries.schedule_send_from,
    schedule_send_to: queries.schedule_send_to,
    created_ids: cast.toArrayAsType(queries.created_ids, Number),
  })
}

const fetchItems = () => {
  return toggleState(() => {
    return store.dispatch('broadcast/LIST_PAGE', route.query).catch(notice.error)
  }, loading)
}

watchSearchForm(updateState, { immediate: true })
watchSearchForm(fetchItems)

const onView = item => {
  selectedItem.value = item
  drawers.view.visible = true
}

const onCopy = item => {
  store
    .dispatch('broadcast/DETAIL', item.id)
    .then(item => {
      selectedItem.value = item.fill({ _is_copy: true })
      drawers.addEdit.visible = true
    })
    .catch(notice.error)
}

const onAddEdit = (item = new Broadcast()) => {
  selectedItem.value = item
  drawers.view.visible = false
  drawers.addEdit.visible = true
}

const onAddEditOk = () => {
  drawers.addEdit.visible = false
  fetchItems()
}

const onCancel = item => {
  return toggleState(() => {
    return store
      .dispatch('broadcast/CANCEL', item.id)
      .then(response => {
        notice.success(response.message)
        fetchItems()
      })
      .catch(notice.error)
  }, loading)
}

const onResend = item => {
  showConfirm({
    title: h('b', 'Xác nhận tiếp tục gửi hàng loạt'),
    icon: h(WarningOutlined, { class: 'text-red-500' }),
    content: h('p', 'Bạn có chắc chắn muốn tiếp tục gửi không?'),
    okText: 'Tiếp tục gửi',
    onOk() {
      toggleState(() => {
        return store
          .dispatch('broadcast/CONTINUE', item.id)
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
  () => statusesRef.value,
  () => {
    fetchDropdowns([
      statusesRef.value,
      typesRef.value,
      reCollectionIdsRef.value,
      createdIdsRef.value,
    ])
  },
)

watch(
  () => searchState.send_modes,
  () => fetchDropdowns(templateCodesRef.value),
)

onMounted(() => {
  Promise.all([
    fetchItems(),
    fetchDropdowns(sendModesRef.value),
    store.dispatch('dropdown/LIST', {
      objects: [
        'broadcast.status',
        'broadcast.type',
      ],
    }),
  ])
})
</script>
