<template>
  <div class="flex flex-col gap-y-4">
    <form-search ref="formRef" :model="searchState">
      <form-item label="Số điện thoại">
        <a-input v-model:value="searchState.phone" allow-clear />
      </form-item>

      <form-item label="Thời gian chặn">
        <filter-date-range v-model:from="searchState.blocked_from" v-model:to="searchState.blocked_to" />
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
    </form-search>

    <div class="flex items-center">
      <div class="flex-auto">
        <h2 class="inline-block font-bold text-base text-indigo-500 mb-0">Danh sách {{ BlacklistRecipient.name }}</h2>
      </div>
      <div class="flex-none flex justify-end gap-x-2">
        <btn-add @click="onAdd()" />
      </div>
    </div>

    <tbl-list :list="list" list-key="blacklist_recipients" :loading="loading" sticky @change="formRef?.paginate">
      <tbl-col
        title="Thời gian"
        data-index="created_at"
        :sorter="true"
        default-sort-order="descend"
        :width="180"
        fixed="left"
        :custom-render="({ value }) => format.toDatetime(value)"
      />
      <tbl-col title="Số điện thoại" data-index="phone" :width="120" fixed="left">
        <template #default="{ value }">
          <data-phone :phone="value" />
        </template>
      </tbl-col>
      <tbl-col
        title="Bắt đầu chặn"
        data-index="blocked_from"
        :sorter="true"
        :width="180"
        :custom-render="({ value }) => format.toDatetime(value)"
      />
      <tbl-col
        title="Kết thúc chặn"
        data-index="blocked_to"
        :sorter="true"
        :width="180"
        :custom-render="({ value }) => (blank(value) ? 'Không thời hạn' : format.toDatetime(value))"
      />
      <tbl-col title="Tài khoản" data-index="created_user" :width="200">
        <template #default="{ value }">
          <data-code-name :model="value" code-field="username" />
        </template>
      </tbl-col>
      <tbl-col title="Hành động" align="center" :width="100" fixed="right">
        <template #default="{ record }">
          <div class="flex justify-center gap-2">
            <btn-delete only-icon tooltip="Xóa" @click="onDelete(record)" />
          </div>
        </template>
      </tbl-col>
    </tbl-list>

    <upsert-blacklist-recipient v-model:visible="drawers.add.visible" @ok="onAddOk" />
  </div>
</template>

<script setup>
import FormSearch from '@/components/Form/Search'
import FormItem from '@/components/Form/Item'
import { computed, onMounted, reactive, ref } from 'vue'
import qs from 'qs'
import { useRoute } from 'vue-router'
import { watchSearchForm } from '@/utils/form'
import TblList from '@/components/Table/List'
import { useStore } from 'vuex'
import { toggleState } from '@/utils/toggle'
import notice from '@/utils/notice'
import format from '@/utils/format'
import BtnDelete from '@/components/Button/Delete'
import { showConfirmDelete } from '@/utils/confirm'
import TblCol from '@/components/Table/Column'
import BtnAdd from '@/components/Button/Add'
import BlacklistRecipient from '@/models/BlacklistRecipient'
import FilterDateRange from '@/components/Form/Search/Filter/DateRange'
import { blank } from '@/utils/variable'
import UpsertBlacklistRecipient from '@/components/Page/Upsert/BlacklistRecipient'
import PulldownDynamic from '@/components/Pulldown/Dynamic'
import cast from '@/utils/cast'
import { fetchDropdowns } from '@/utils/dropdown'
import DataPhone from '@/components/Page/Data/Phone'
import DataCodeName from '@/components/Page/Data/CodeName'

const route = useRoute()
const store = useStore()

const formRef = ref(null)
const loading = ref(false)
const createdIdsRef = ref(null)

const drawers = reactive({
  add: {
    visible: false,
  },
})

const list = computed(() => store.getters['blacklistRecipient/getList'])

const searchState = reactive({})
const updateState = () => {
  const queries = qs.parse(route.query)
  Object.assign(searchState, {
    phone: queries.phone,
    blocked_from: queries.blocked_from,
    blocked_to: queries.blocked_to,
    created_ids: cast.toArrayAsType(queries.created_ids, Number),
  })
}

const fetchItems = () => {
  return toggleState(() => {
    return store.dispatch('blacklistRecipient/LIST_PAGE', route.query).catch(notice.error)
  }, loading)
}

watchSearchForm(updateState, { immediate: true })
watchSearchForm(fetchItems)

const onAdd = () => {
  drawers.add.visible = true
}

const onAddOk = () => {
  drawers.add.visible = false
  fetchItems()
}

const onDelete = item => {
  showConfirmDelete(BlacklistRecipient.name, item.phone, {
    onOk() {
      toggleState(() => {
        return store
          .dispatch('blacklistRecipient/DELETE', item.id)
          .then(response => {
            notice.success(response.message)
            fetchItems()
          })
          .catch(notice.error)
      }, loading)
    },
  })
}

onMounted(() => {
  Promise.all([
    fetchItems(),
    fetchDropdowns(createdIdsRef.value),
  ])
})
</script>
