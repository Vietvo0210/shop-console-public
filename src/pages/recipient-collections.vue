<template>
  <div class="flex flex-col gap-y-4">
    <form-search ref="formRef" :model="searchState">
      <form-item label="Từ khóa">
        <a-input v-model:value="searchState.keyword" placeholder="Tìm theo ID, mã, tên, ..." allow-clear />
      </form-item>

      <form-item label="Loại">
        <pulldown-dynamic
          ref="typesRef"
          object="recipient_collection.type"
          v-model:value="searchState.types"
          mode="multiple"
        />
      </form-item>

      <form-item label="Trạng thái">
        <pulldown-dynamic
          ref="statusesRef"
          object="recipient_collection.status"
          v-model:value="searchState.statuses"
          mode="multiple"
        />
      </form-item>

      <template #detail>
        <form-item label="Thời gian import">
          <filter-date-range v-model:from="searchState.imported_from" v-model:to="searchState.imported_to" />
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
        <h2 class="inline-block font-bold text-base text-indigo-500 mb-0">Danh sách {{ RecipientCollection.name }}</h2>
      </div>
      <div class="flex-none flex justify-end gap-x-2">
        <btn-add icon="file-plus" text="Import" @click="drawers.import.visible = true" />
      </div>
    </div>

    <tbl-list :list="list" list-key="recipient_collections" :loading="loading" sticky @change="formRef?.paginate">
      <tbl-col title="ID" data-index="id" :sorter="true" default-sort-order="descend" :width="80" fixed="left" />
      <tbl-col title="Mã" data-index="code" :width="150" fixed="left">
        <template #default="{ value }">
          <tag theme="primary">{{ value }}</tag>
        </template>
      </tbl-col>
      <tbl-col title="Tên" data-index="name" :width="300" fixed="left" />
      <tbl-col title="Loại" data-index="type" :width="200">
        <template #default="{ value }">
          <data-enum enum="recipient_collection.type" :value="value" />
        </template>
      </tbl-col>
      <tbl-col title="Trạng thái" data-index="status" :width="200">
        <template #default="{ record, value }">
          <data-enum enum="recipient_collection.status" :value="value">
            <template v-if="notEmpty(record.error_messages)" #tooltip>
              <div class="flex flex-col gap-y-2">
                <p v-for="(error, index) in record.error_messages.slice(0, 10)" :key="index" class="mb-0">
                  {{ error }}
                </p>
              </div>
            </template>
          </data-enum>
        </template>
      </tbl-col>
      <tbl-col
        title="Tổng số"
        data-index="total"
        :sorter="true"
        :width="100"
        :custom-render="({ value }) => format.toNumber(value)"
      />
      <tbl-col title="Thời gian import" data-index="imported_from" :sorter="true" :width="340">
        <template #default="{ record }">
          {{ format.toDatetime(record.imported_from) }} → {{ format.toDatetime(record.imported_to) }}
        </template>
      </tbl-col>
      <tbl-col title="Tài khoản" data-index="created_user" :width="200">
        <template #default="{ value }">
          <data-code-name :model="value" code-field="username" />
        </template>
      </tbl-col>
      <tbl-col title="Hành động" align="center" :width="200" fixed="right">
        <template #default="{ record }">
          <div class="flex justify-center gap-2">
            <btn only-icon theme="info" icon="list" tooltip="Danh sách người nhận" @click="onViewRecipients(record)" />
            <btn-download :loading="downloading[record.id]" only-icon tooltip="Tải xuống" @click="onDownload(record)" />
            <btn-view only-icon tooltip="Xem" @click="onView(record)" />
            <btn-delete only-icon tooltip="Xóa" @click="onDelete(record)" />
          </div>
        </template>
      </tbl-col>
    </tbl-list>

    <view-recipient-collection v-model:visible="drawers.view.visible" :item="selectedItem" />
    <import-recipient-collection v-model:visible="drawers.import.visible" @ok="onImportOk" />
    <list-recipient v-model:visible="modals.viewRecipients.visible" :re-collection="selectedItem" />
  </div>
</template>

<script setup>
import FormSearch from '@/components/Form/Search'
import FormItem from '@/components/Form/Item'
import { computed, onMounted, reactive, ref, watch } from 'vue'
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
import RecipientCollection from '@/models/RecipientCollection'
import BtnView from '@/components/Button/View'
import BtnDelete from '@/components/Button/Delete'
import { showConfirmDelete } from '@/utils/confirm'
import ViewRecipientCollection from '@/components/Page/View/RecipientCollection'
import Tag from '@/components/Tag'
import TblCol from '@/components/Table/Column'
import BtnAdd from '@/components/Button/Add'
import ImportRecipientCollection from '@/components/Page/Import/RecipientCollection'
import BtnDownload from '@/components/Button/Download'
import { preformDownload } from '@/utils/download'
import Btn from '@/components/Button'
import DataEnum from '@/components/Page/Data/Enum'
import { notEmpty } from '@/utils/variable'
import ListRecipient from '@/components/Page/List/Recipient'
import FilterDateRange from '@/components/Form/Search/Filter/DateRange'
import DataCodeName from '@/components/Page/Data/CodeName'

const route = useRoute()
const store = useStore()

const formRef = ref(null)
const loading = ref(false)
const downloading = reactive({})
const typesRef = ref(null)
const statusesRef = ref(null)
const createdIdsRef = ref(null)

const modals = reactive({
  viewRecipients: {
    visible: false,
  },
})
const drawers = reactive({
  view: {
    visible: false,
  },
  import: {
    visible: false,
  },
})
const selectedItem = ref(null)

const list = computed(() => store.getters['recipientCollection/getList'])

const searchState = reactive({})
const updateState = () => {
  const queries = qs.parse(route.query)
  Object.assign(searchState, {
    keyword: queries.keyword,
    types: cast.toArrayAsType(queries.types, Number),
    statuses: cast.toArrayAsType(queries.statuses, Number),
    imported_from: queries.schedule_send_from,
    imported_to: queries.schedule_send_to,
    created_ids: cast.toArrayAsType(queries.created_ids, Number),
  })
}

const fetchItems = () => {
  return toggleState(() => {
    return store.dispatch('recipientCollection/LIST_PAGE', route.query).catch(notice.error)
  }, loading)
}

watchSearchForm(updateState, { immediate: true })
watchSearchForm(fetchItems)

const onViewRecipients = item => {
  selectedItem.value = item
  modals.viewRecipients.visible = true
}

const onView = item => {
  selectedItem.value = item
  drawers.view.visible = true
}

const onImportOk = () => {
  drawers.import.visible = false
  fetchItems()
}

const onDelete = item => {
  showConfirmDelete(RecipientCollection.name, item.name, {
    onOk() {
      toggleState(() => {
        return store
          .dispatch('recipientCollection/DELETE', item.id)
          .then(response => {
            notice.success(response.message)
            fetchItems()
          })
          .catch(notice.error)
      }, loading)
    },
  })
}

const onDownload = item => {
  toggleState(
    () => {
      return store
        .dispatch('recipientCollection/DOWNLOAD', item.id)
        .then(blob => preformDownload(blob, item.filename))
        .catch(notice.error)
    },
    downloading,
    item.id,
  )
}

watch(
  () => createdIdsRef.value,
  () => {
    fetchDropdowns(createdIdsRef.value)
  },
)

onMounted(() => {
  Promise.all([
    fetchItems(),
    fetchDropdowns([
      typesRef.value,
      statusesRef.value,
    ]),
  ])
})
</script>
