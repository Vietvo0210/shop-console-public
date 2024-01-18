<template>
  <a-divider orientation="left" class="mb-2">
    <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
      <icon-fe type="settings" />
      Định nghĩa dữ liệu file import
    </div>
  </a-divider>

  <div class="flex flex-col divide-y py-4">
    <div class="px-4 pb-4">
      <b>Các dòng đầu tiên</b>
      <tbl
        :data-source="fileDefinition.head_row_data"
        :show-header="false"
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
    <view-item title="Tổng số dòng">{{ format.toNumber(fileDefinition.total_row) }}</view-item>
    <view-item title="Ký tự phân cách">
      <span class="bg-yellow-500 inline-block text-center w-[16px] leading-[16px]">
        {{ fileDefinition.separator }}
      </span>
    </view-item>
    <view-item title="Đọc từ dòng">{{ format.toNumber(fileDefinition.start_row) }}</view-item>
    <view-item title="Đọc đến dòng">{{ format.toNumber(fileDefinition.end_row) }}</view-item>
    <view-item title="Cột chứa Số điện thoại">{{ format.toNumber(fileDefinition.phone_column) }}</view-item>
    <view-item title="Cột chứa Tracking">{{ format.toNumber(fileDefinition.tracking_column) }}</view-item>
    <view-item title="Bỏ qua SĐT không hợp lệ">
      {{ TruthyEnum[cast.toNumber(fileDefinition.skip_invalid_phone)] }}
    </view-item>
    <view-item title="Bỏ qua SĐT bị chặn">
      {{ TruthyEnum[cast.toNumber(fileDefinition.skip_blacklist_phone)] }}
    </view-item>
  </div>
</template>

<script>
export default {
  name: 'ViewRecipientCollectionFileDefinition',
}
</script>

<script setup>
import { h } from 'vue'
import format from '@/utils/format'
import { TruthyEnum } from '@/utils/enums'
import cast from '@/utils/cast'
import Tbl from '@/components/Table'
import IconFe from '@/components/Icon/Fe'
import ViewItem from '@/components/Page/View/Item'
import TblCol from '@/components/Table/Column'

const props = defineProps({
  fileDefinition: {
    type: Object,
    default: () => ({}),
  },
})
</script>
