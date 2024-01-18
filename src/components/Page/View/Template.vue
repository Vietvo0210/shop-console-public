<template>
  <drawer-view :title="'Xem chi tiết ' + Template.name" :item="itemState" :loading="loading">
    <div class="flex flex-col divide-y py-4">
      <view-item title="ID">{{ itemState.id }}</view-item>
      <view-item title="Mã">
        <tag theme="primary">{{ itemState.code }}</tag>
      </view-item>
      <view-item title="Tiêu đề">{{ itemState.name }}</view-item>
      <view-item title="Kiểu gửi">
        <data-enum enum="message.send_mode" :value="itemState.send_mode" />
      </view-item>
      <view-item title="Người gửi tin">{{ itemState.sender?.name }}</view-item>

      <view-item title="Người thêm">{{ itemState.created_user?.name }}</view-item>
      <view-item title="Ngày thêm">{{ format.toDatetime(itemState.created_at) }}</view-item>
      <view-item title="Cập nhật lần cuối">{{ format.toDatetime(itemState.updated_at) }}</view-item>
    </div>

    <a-divider orientation="left" class="mb-2">
      <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
        <icon-fe type="message-square" />
        Xem trước tin nhắn
      </div>
    </a-divider>
    <component
      :is="ViewMessageComponent"
      :template="itemState"
      :class="{ 'w-[336px]': ViewMessageComponent !== ViewMessageZns }"
    />
  </drawer-view>
</template>

<script>
export default {
  name: 'ViewTemplate',
}
</script>

<script setup>
import DrawerView from '@/components/Drawer/View'
import { computed, reactive, ref, useAttrs, watch } from 'vue'
import { toggleState } from '@/utils/toggle'
import { useStore } from 'vuex'
import Template from '@/models/Template'
import notice from '@/utils/notice'
import ViewItem from '@/components/Page/View/Item'
import format from '@/utils/format'
import Tag from '@/components/Tag'
import DataEnum from '@/components/Page/Data/Enum'
import IconFe from '@/components/Icon/Fe'
import { SendMode } from '@/utils/enums'
import ViewMessageZms from '@/components/Page/View/Message/ZMS'
import ViewMessageZns from '@/components/Page/View/Message/ZNS'
import ViewMessageSms from '@/components/Page/View/Message/SMS'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const attrs = useAttrs()
const store = useStore()

const loading = ref(false)
const itemState = reactive(new Template())

const ViewMessageComponent = computed(() => {
  const mapping = {
    [SendMode.ZMS]: ViewMessageZms,
    [SendMode.ZNS]: ViewMessageZns,
    [SendMode.SMS]: ViewMessageSms,
  }
  return mapping[itemState.send_mode]
})

const fetchItem = () => {
  itemState.fill(props.item)

  return store
    .dispatch('template/DETAIL', itemState.id)
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
          store.dispatch('dropdown/LIST', { objects: ['sender.type'] }),
        ])
      }, loading)
    }
  },
)
</script>
