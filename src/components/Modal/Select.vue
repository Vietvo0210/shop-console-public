<template>
  <modal title="Lựa chọn" :width="720" mask-closable :footer="null">
    <form-search-modal v-bind="searchFormProps" v-on="searchFormEvents">
      <slot name="searchForm" />
      <template v-if="$slots.searchFormDetail" #detail>
        <slot name="searchFormDetail" />
      </template>
    </form-search-modal>

    <tbl-list
      class="mt-3"
      :list-key="tableProps.listKey"
      :row-selection="selectable ? rowSelection : null"
      v-bind="tableProps"
      v-on="tablePropsEvents"
    >
      <template #bodyCell="options">
        <slot name="tableBodyCell" v-bind="options" />
      </template>

      <slot name="tableDefault" />
    </tbl-list>
  </modal>
</template>

<script>
export default {
  name: 'ModalSelect',
}
</script>

<script setup>
import _ from 'lodash'
import { computed, reactive } from 'vue'
import TblList from '@/components/Table/List'
import FormSearchModal from '@/components/Form/Search/Modal'
import Modal from '@/components/Modal'

const props = defineProps({
  searchFormProps: {
    type: Object,
    default: () => ({}),
  },
  searchFormEvents: {
    type: Object,
    default: () => ({}),
  },
  tableProps: {
    type: Object,
    default: () => ({}),
  },
  tablePropsEvents: {
    type: Object,
    default: () => ({}),
  },
  selected: {
    type: Array,
    default: () => [],
  },
  rowSelectionType: {
    type: String,
    default: 'checkbox',
  },
  selectable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['change', 'update:selected'])

const rowSelection = reactive({
  type: props.rowSelectionType,
  selectedRowKeys: computed(() => {
    const rowKey = props.tableProps.rowKey ?? 'id'
    return _.map(props.selected, rowKey)
  }),
  onChange: (selectedRowKeys, selectedRows) => {
    emit('change', selectedRows)
    emit('update:selected', selectedRows)
  },
})
</script>
