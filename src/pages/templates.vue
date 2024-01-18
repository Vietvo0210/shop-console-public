<template>
  <div class="flex flex-col gap-y-4">
    <form-search ref="formRef" :model="searchState">
      <form-item label="Từ khóa">
        <a-input v-model:value="searchState.keyword" placeholder="Tìm theo ID, mã, tên, ..." allow-clear />
      </form-item>

      <form-item label="Kiểu gửi">
        <pulldown-dynamic
          ref="sendModesRef"
          object="message.send_mode"
          v-model:value="searchState.send_modes"
          mode="multiple"
        />
      </form-item>

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

      <template #detail>
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
        <h2 class="inline-block font-bold text-base text-indigo-500 mb-0">Danh sách {{ Template.name }}</h2>
      </div>
      <div class="flex-none flex justify-end gap-x-2">
        <btn :loading="pullingZns" theme="warning" icon="refresh-cw" text="Đồng bộ mẫu tin ZNS" @click="onPullZns" />
        <btn-add @click="onAddEdit()" />
      </div>
    </div>

    <tbl-list :list="list" list-key="templates" :loading="loading" sticky @change="formRef?.paginate">
      <tbl-col title="ID" data-index="id" :sorter="true" default-sort-order="descend" :width="80" fixed="left" />
      <tbl-col title="Mã" data-index="code" :width="150" fixed="left">
        <template #default="{ value }">
          <tag theme="primary">{{ value }}</tag>
        </template>
      </tbl-col>
      <tbl-col title="Tên" data-index="name" :width="300" fixed="left" />
      <tbl-col title="Kiểu gửi" data-index="send_mode" :width="200">
        <template #default="{ value }">
          <data-enum enum="message.send_mode" :value="value" />
        </template>
      </tbl-col>
      <tbl-col title="Người gửi tin" data-index="sender" :width="200">
        <template #default="{ value }">
          <data-code-name :model="value" />
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
      <tbl-col title="Hành động" align="center" :width="200" fixed="right">
        <template #default="{ record }">
          <div class="flex justify-center gap-2">
            <btn
              only-icon
              theme="info"
              icon="message-square"
              tooltip="Xem trước tin nhắn"
              @click="onViewMessage(record)"
            />
            <btn-view only-icon tooltip="Xem" @click="onView(record)" />
            <template v-if="record.send_mode !== SendMode.ZNS">
              <btn-edit only-icon tooltip="Sửa" @click="onAddEdit(record)" />
              <btn-delete only-icon tooltip="Xóa" @click="onDelete(record)" />
            </template>
          </div>
        </template>
      </tbl-col>
    </tbl-list>

    <modal-view-message
      title="Xem trước tin nhắn"
      v-model:visible="modals.viewMessage.visible"
      :template="selectedItem"
    />
    <view-template
      v-model:visible="drawers.view.visible"
      :item="selectedItem"
      :to-edit="() => onAddEdit(selectedItem)"
    />
    <add-edit-template v-model:visible="drawers.addEdit.visible" :item="selectedItem" @ok="onAddEditOk" />
  </div>
</template>

<script setup>
import qs from 'qs'
import cast from '@/utils/cast'
import format from '@/utils/format'
import notice from '@/utils/notice'
import { showConfirmDelete } from '@/utils/confirm'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { watchSearchForm } from '@/utils/form'
import { fetchDropdowns } from '@/utils/dropdown'
import { useStore } from 'vuex'
import { toggleState } from '@/utils/toggle'
import { SendMode } from '@/utils/enums'
import AddEditTemplate from '@/components/Page/AddEdit/Template'
import BtnAdd from '@/components/Button/Add'
import BtnView from '@/components/Button/View'
import BtnEdit from '@/components/Button/Edit'
import BtnDelete from '@/components/Button/Delete'
import FormItem from '@/components/Form/Item'
import FormSearch from '@/components/Form/Search'
import PulldownDynamic from '@/components/Pulldown/Dynamic'
import TblList from '@/components/Table/List'
import Template from '@/models/Template'
import ViewTemplate from '@/components/Page/View/Template'
import Btn from '@/components/Button'
import Tag from '@/components/Tag'
import TblCol from '@/components/Table/Column'
import DataEnum from '@/components/Page/Data/Enum'
import ModalViewMessage from '@/components/Modal/View/Message'
import FilterDateRange from '@/components/Form/Search/Filter/DateRange'
import DataCodeName from '@/components/Page/Data/CodeName'

const route = useRoute()
const store = useStore()

const formRef = ref(null)
const loading = ref(false)
const sendModesRef = ref(null)
const senderCodesRef = ref(null)
const createdIdsRef = ref(null)

const modals = reactive({
  viewMessage: {
    visible: false,
  },
})
const drawers = reactive({
  view: {
    visible: false,
  },
  addEdit: {
    visible: false,
  },
})
const selectedItem = ref(null)
const pullingZns = ref(false)

const list = computed(() => store.getters['template/getList'])

const searchState = reactive({})
const updateState = () => {
  const queries = qs.parse(route.query)
  Object.assign(searchState, {
    keyword: queries.keyword,
    send_modes: cast.toArrayAsType(queries.send_modes, Number),
    sender_codes: cast.toArray(queries.sender_codes),
    created_from: queries.created_from,
    created_to: queries.created_to,
    created_ids: cast.toArrayAsType(queries.created_ids, Number),
  })
}

const fetchItems = () => {
  return toggleState(() => {
    return store.dispatch('template/LIST_PAGE', route.query).catch(notice.error)
  }, loading)
}

watchSearchForm(updateState, { immediate: true })
watchSearchForm(fetchItems)

const onViewMessage = item => {
  selectedItem.value = item
  modals.viewMessage.visible = true
}

const onView = item => {
  selectedItem.value = item
  drawers.view.visible = true
}

const onAddEdit = (item = new Template()) => {
  selectedItem.value = item
  drawers.view.visible = false
  drawers.addEdit.visible = true
}

const onAddEditOk = () => {
  drawers.addEdit.visible = false
  fetchItems()
}

const onDelete = item => {
  showConfirmDelete(Template.name, item.name, {
    onOk() {
      toggleState(() => {
        return store
          .dispatch('template/DELETE', item.id)
          .then(response => {
            notice.success(response.message)
            fetchItems()
          })
          .catch(notice.error)
      }, loading)
    },
  })
}

const onPullZns = () => {
  toggleState(() => {
    return store
      .dispatch('template/PULL_ZNS')
      .then(response => {
        const { pulled } = response.data
        if (pulled > 0) {
          notice.success(response.message, { description: `Đã đồng bộ ${format.toNumber(pulled)} mẫu tin ZNS` })
          fetchItems()
          return
        }
        notice.warning('Không có mẫu tin ZNS nào')
      })
      .catch(notice.error)
  }, pullingZns)
}

watch(
  () => createdIdsRef.value,
  () => {
    fetchDropdowns(createdIdsRef.value)
  },
)

watch(
  () => searchState.send_modes,
  () => {
    fetchDropdowns(senderCodesRef.value)
  },
)

onMounted(() => {
  Promise.all([
    fetchItems(),
    fetchDropdowns([
      sendModesRef.value,
      senderCodesRef.value,
    ]),
  ])
})
</script>
