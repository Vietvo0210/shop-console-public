<template>
  <div class="flex flex-col gap-y-4">
    <form-search ref="formRef" :model="searchState">
      <form-item label="Loại">
        <pulldown-dynamic ref="typesRef" object="download.type" v-model:value="searchState.types" mode="multiple" />
      </form-item>

      <form-item label="Trạng thái">
        <pulldown-dynamic
          ref="statusesRef"
          object="download.status"
          v-model:value="searchState.statuses"
          mode="multiple"
        />
      </form-item>

      <form-item label="Thời gian">
        <filter-date-range v-model:from="searchState.downloaded_from" v-model:to="searchState.downloaded_to" />
      </form-item>

      <template #detail>
        <form-item label="Thời gian tải xuống">
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
        <h2 class="inline-block font-bold text-base text-indigo-500 mb-0">Danh sách {{ Download.name }}</h2>
      </div>
    </div>

    <tbl-list :list="list" list-key="downloads" :loading="loading" sticky @change="formRef?.paginate">
      <tbl-col
        title="Thời gian"
        data-index="created_at"
        :sorter="true"
        default-sort-order="descend"
        :width="160"
        fixed="left"
      >
        <template #default="{ value }">
          <span :class="{ 'text-indigo-500': cast.toDayjs(value).isSame(new Date(), 'day') }">
            {{ format.toDatetime(value) }}
          </span>
        </template>
      </tbl-col>
      <tbl-col title="Mã" data-index="code" :width="150" fixed="left">
        <template #default="{ value }">
          <tag theme="primary">{{ value }}</tag>
        </template>
      </tbl-col>
      <tbl-col title="Tài khoản" data-index="created_user" :width="200">
        <template #default="{ value }">
          <data-code-name :model="value" code-field="username" />
        </template>
      </tbl-col>
      <tbl-col title="Loại" data-index="type" :width="200">
        <template #default="{ value }">
          <data-enum enum="download.type" :value="value" />
        </template>
      </tbl-col>
      <tbl-col title="Trạng thái" data-index="status" :width="200">
        <template #default="{ record, value }">
          <data-enum enum="download.status" :value="value" :tooltip="record.error_message" />
          <a-progress v-if="record.status === DownloadStatus.PROCESSING" :percent="record.progress" size="small" />
        </template>
      </tbl-col>
      <tbl-col title="Thời gian xử lý" data-index="downloaded_from" :sorter="true" :width="340">
        <template #default="{ record }">
          {{ format.toDatetime(record.downloaded_from) }} → {{ format.toDatetime(record.downloaded_to) }}
        </template>
      </tbl-col>
      <tbl-col
        title="Tổng số dữ liệu"
        data-index="total"
        :sorter="true"
        :width="120"
        :custom-render="({ value }) => format.toNumber(value)"
      />
      <tbl-col title="Hành động" align="center" :width="100" fixed="right">
        <template #default="{ record }">
          <div class="flex justify-center gap-2">
            <btn-download
              v-if="record.total > 0"
              :loading="downloading[record.id]"
              only-icon
              tooltip="Tải xuống"
              @click="onDownload(record)"
            />
            <btn-delete only-icon tooltip="Xóa" @click="onDelete(record)" />
          </div>
        </template>
      </tbl-col>
    </tbl-list>
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
import BtnDelete from '@/components/Button/Delete'
import FormItem from '@/components/Form/Item'
import FormSearch from '@/components/Form/Search'
import PulldownDynamic from '@/components/Pulldown/Dynamic'
import TblList from '@/components/Table/List'
import Download from '@/models/Download'
import Tag from '@/components/Tag'
import TblCol from '@/components/Table/Column'
import DataEnum from '@/components/Page/Data/Enum'
import BtnDownload from '@/components/Button/Download'
import { DownloadStatus } from '@/utils/enums'
import { preformDownload } from '@/utils/download'
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

const list = computed(() => store.getters['download/getList'])

const searchState = reactive({})
const updateState = () => {
  const queries = qs.parse(route.query)
  Object.assign(searchState, {
    types: cast.toArray(queries.types),
    statuses: cast.toArrayAsType(queries.statuses, Number),
    downloaded_from: queries.downloaded_from,
    downloaded_to: queries.downloaded_to,
    created_from: queries.created_from,
    created_to: queries.created_to,
    created_ids: cast.toArrayAsType(queries.created_ids, Number),
  })
}

const fetchItems = () => {
  return toggleState(() => {
    return store.dispatch('download/LIST_PAGE', route.query).catch(notice.error)
  }, loading)
}

watchSearchForm(updateState, { immediate: true })
watchSearchForm(fetchItems)

const onDelete = item => {
  showConfirmDelete(Download.name, item.code, {
    onOk() {
      toggleState(() => {
        return store
          .dispatch('download/DELETE', item.id)
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
        .dispatch('download/DOWNLOAD', item.id)
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
