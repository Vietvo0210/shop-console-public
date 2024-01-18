<template>
  <modal-select
    :title="`Danh sách người nhận tin (${reCollection?.code})`"
    :width="1140"
    :selectable="false"
    :search-form-events="{ search: fetchItems, reset: onReset }"
    :table-props="{ list, listKey: 'recipients', loading, sticky: true }"
    :table-props-events="{ change: changeTable }"
  >
    <template #searchForm>
      <form-item label="Số điện thoại">
        <a-input v-model:value="searchState.phone" allow-clear />
      </form-item>
      <form-item label="Thông tin">
        <a-input v-model:value="searchState.info" placeholder="Thông tin ở các cột..." allow-clear />
      </form-item>
    </template>

    <template #tableDefault>
      <tbl-col title="Số điện thoại" data-index="phone" :width="140" fixed="left" />
      <tbl-col title="Tracking" data-index="tracking" :width="150" />
      <tbl-col
        v-for="colIndex in _.get(list.recipients, '0.info.length')"
        :key="colIndex"
        :title="`Thông tin - Cột ${colIndex}`"
        data-index="info"
        :width="300"
        :custom-render="({ value }) => value[colIndex - 1]"
      />
    </template>
  </modal-select>
</template>

<script>
export default {
  name: 'ListRecipient',
}
</script>

<script setup>
import ModalSelect from '@/components/Modal/Select'
import FormItem from '@/components/Form/Item'
import { reactive, ref, useAttrs, watch } from 'vue'
import { useStore } from 'vuex'
import { toggleState } from '@/utils/toggle'
import _ from 'lodash'
import notice from '@/utils/notice'
import TblCol from '@/components/Table/Column'
import { PAGE_SIZE_MODAL } from '@/utils/consts'

const props = defineProps({
  reCollection: {
    type: Object,
    default: () => ({}),
  },
})

const store = useStore()
const attrs = useAttrs()

const defaultState = Object.freeze({
  page: 1,
  limit: PAGE_SIZE_MODAL,
  phone: null,
  info: null,
})

const list = ref({})
const searchState = reactive(_.cloneDeep(defaultState))
const loading = ref(false)

const fetchItems = () => {
  const queries = Object.assign(searchState, {
    collection_id: props.reCollection.id,
  })
  return toggleState(() => {
    return store
      .dispatch('recipient/LIST', queries)
      .then(data => (list.value = data))
      .catch(notice.error)
  }, loading)
}

const onReset = () => {
  Object.assign(searchState, _.cloneDeep(defaultState))
  fetchItems()
}

const changeTable = pagination => {
  Object.assign(searchState, {
    page: pagination.current,
    limit: pagination.pageSize,
  })
  fetchItems()
}

watch(
  () => attrs.visible,
  visible => {
    if (visible) {
      onReset()
    }
  },
)
</script>
