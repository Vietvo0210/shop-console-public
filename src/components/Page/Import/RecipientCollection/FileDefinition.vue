<template>
  <a-divider orientation="left" class="mb-0">
    <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
      <icon-fe type="settings" />
      Định nghĩa dữ liệu file import
    </div>
  </a-divider>

  <p class="m-0"><b>Tổng số dòng: </b>{{ format.toNumber(fileDefinition.total_row) }}</p>
  <div>
    <b>Các dòng đầu tiên</b>
    <tbl
      :data-source="fileDefinition.head_row_data"
      :show-header="false"
      tiên
      :pagination="false"
      row-class-name="font-mono text-xs overflow-x-auto"
    >
      <tbl-col
        v-for="column in fileDefinition.total_column"
        :key="column"
        :custom-render="({ record }) => h('span', record[column - 1])"
      />
    </tbl>
  </div>

  <p v-if="notBlank(fileDefinition.separator)" class="m-0">
    <b>Ký tự phân cách: </b>
    <span class="bg-yellow-500 inline-block text-center w-[16px] leading-[16px]">{{ fileDefinition.separator }}</span>
  </p>

  <div class="grid grid-cols-2 gap-4">
    <form-item :name="['file_definition', 'start_row']" label="Đọc từ dòng" required>
      <a-input-number
        type="number"
        :value="fileDefinition.start_row"
        :min="1"
        :max="fileDefinition.total_row"
        @change="v => onChange({ start_row: v })"
      />
    </form-item>

    <form-item :name="['file_definition', 'end_row']" label="Đọc đến dòng" required>
      <a-input-number
        type="number"
        :value="fileDefinition.end_row"
        :min="fileDefinition.start_row"
        :max="fileDefinition.total_row"
        @change="v => onChange({ end_row: v })"
      />
    </form-item>

    <form-item :name="['file_definition', 'phone_column']" label="Cột chứa Số điện thoại" required>
      <a-input-number
        type="number"
        :value="fileDefinition.phone_column"
        :min="1"
        :max="fileDefinition.total_column"
        @change="v => onChange({ phone_column: v })"
      />
    </form-item>

    <form-item :name="['file_definition', 'tracking_column']" label="Cột chứa Tracking">
      <a-input-number
        type="number"
        :value="fileDefinition.tracking_column"
        :min="1"
        :max="fileDefinition.total_column"
        @change="v => onChange({ tracking_column: v })"
      />
    </form-item>

    <form-item :name="['file_definition', 'skip_invalid_phone']" label="Bỏ qua SĐT không hợp lệ" :show-label="false">
      <a-checkbox
        :checked="fileDefinition.skip_invalid_phone"
        @change="onChange({ skip_invalid_phone: $event.target.checked })"
      >
        Bỏ qua SĐT không hợp lệ
      </a-checkbox>
    </form-item>

    <form-item :name="['file_definition', 'skip_blacklist_phone']" label="Bỏ qua SĐT bị chặn" :show-label="false">
      <a-checkbox
        :checked="fileDefinition.skip_blacklist_phone"
        @change="onChange({ skip_blacklist_phone: $event.target.checked })"
      >
        Bỏ qua SĐT bị chặn
      </a-checkbox>
    </form-item>
  </div>
</template>

<script>
export default {
  name: 'ImportFileDefinition',
}
</script>

<script setup>
import FormItem from '@/components/Form/Item'
import format from '@/utils/format'
import Tbl from '@/components/Table'
import TblCol from '@/components/Table/Column'
import { notBlank } from '@/utils/variable'
import { h } from 'vue'
import IconFe from '@/components/Icon/Fe'
import { setMany } from '@/utils/collection'

const props = defineProps({
  fileDefinition: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:fileDefinition'])

const onChange = values => {
  emit('update:fileDefinition', setMany(props.fileDefinition, values))
}
</script>
