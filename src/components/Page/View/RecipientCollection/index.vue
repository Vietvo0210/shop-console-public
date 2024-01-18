<template>
  <drawer-view :title="'Xem chi tiết ' + RecipientCollection.name" :item="itemState" :loading="loading">
    <div class="flex flex-col divide-y py-4">
      <view-item title="ID">{{ itemState.id }}</view-item>
      <view-item title="Mã">
        <tag theme="primary">{{ itemState.code }}</tag>
      </view-item>
      <view-item title="Tên">{{ itemState.name }}</view-item>
      <view-item title="Loại">
        <data-enum enum="recipient_collection.type" :value="itemState.type" />
      </view-item>
      <view-item title="Trạng thái">
        <data-enum enum="recipient_collection.status" :value="itemState.status" />
      </view-item>
      <view-item title="Tổng số người nhận tin">{{ format.toNumber(itemState.total) }}</view-item>
      <view-item title="Thời gian import">
        <p class="mb-0">
          {{ format.toDatetime(itemState.imported_from) }} → {{ format.toDatetime(itemState.imported_to) }}
        </p>
        <small class="text-slate-500">
          Quá trình import mất: <b>{{ importedDuration }}</b>
        </small>
      </view-item>

      <view-item title="Người thêm">{{ itemState.created_user?.name }}</view-item>
      <view-item title="Ngày thêm">{{ format.toDatetime(itemState.created_at) }}</view-item>
      <view-item title="Cập nhật lần cuối">{{ format.toDatetime(itemState.updated_at) }}</view-item>
    </div>

    <view-file-definition
      v-if="itemState.type === RecipientCollectionType.IMPORT"
      :file-definition="itemState.file_definition"
    />
  </drawer-view>
</template>

<script>
export default {
  name: 'ViewRecipientCollection',
}
</script>

<script setup>
import DrawerView from '@/components/Drawer/View'
import { computed, reactive, ref, useAttrs, watch } from 'vue'
import { toggleState } from '@/utils/toggle'
import { useStore } from 'vuex'
import RecipientCollection from '@/models/RecipientCollection'
import notice from '@/utils/notice'
import ViewItem from '@/components/Page/View/Item'
import format from '@/utils/format'
import Tag from '@/components/Tag'
import DataEnum from '@/components/Page/Data/Enum'
import { RecipientCollectionType } from '@/utils/enums'
import cast from '@/utils/cast'
import ViewFileDefinition from '@/components/Page/View/RecipientCollection/FileDefinition'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const attrs = useAttrs()
const store = useStore()

const loading = ref(false)
const itemState = reactive(new RecipientCollection())

const fileDefinition = computed(() => itemState.file_definition)

const importedDuration = computed(() => {
  const diff = itemState.imported_histories.reduce((duration, history) => {
    return duration + cast.toDayjs(history.imported_to).diff(cast.toDayjs(history.imported_from))
  }, 0)
  return format.toDuration(diff)
})

const fetchItem = () => {
  itemState.fill(props.item)

  return store
    .dispatch('recipientCollection/DETAIL', itemState.id)
    .then(item => itemState.fill(item))
    .catch(notice.error)
}

watch(
  () => attrs.visible,
  visible => {
    if (visible) {
      toggleState(() => {
        return Promise.all([
          fetchItem(),
          store.dispatch('dropdown/LIST', {
            objects: [
              'recipient_collection.type',
              'recipient_collection.status',
            ],
          }),
        ])
      }, loading)
    }
  },
)
</script>
