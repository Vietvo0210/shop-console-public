<template>
  <drawer-view :title="'Xem chi tiết ' + Sender.name" :item="itemState" :loading="loading">
    <div class="flex flex-col divide-y py-4">
      <view-item title="ID">{{ itemState.id }}</view-item>
      <view-item title="Mã">
        <tag theme="primary">{{ itemState.code }}</tag>
      </view-item>
      <view-item title="Tên">{{ itemState.name }}</view-item>
      <view-item title="Loại">
        <data-enum enum="sender.type" :value="itemState.type" />
      </view-item>
      <view-item title="Nền tảng">
        <data-enum enum="sender.platform" :value="itemState.platform" />
      </view-item>

      <view-item title="Người thêm">{{ itemState.created_user?.name }}</view-item>
      <view-item title="Ngày thêm">{{ format.toDatetime(itemState.created_at) }}</view-item>
      <view-item title="Cập nhật lần cuối">{{ format.toDatetime(itemState.updated_at) }}</view-item>
    </div>

    <a-divider orientation="left" class="mb-2">
      <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
        <icon-fe type="settings" />
        Thông tin cấu hình
      </div>
    </a-divider>
    <component :is="ViewPlatformComponent" :info="itemState.info" />
  </drawer-view>
</template>

<script>
export default {
  name: 'ViewSender',
}
</script>

<script setup>
import DrawerView from '@/components/Drawer/View'
import { computed, reactive, ref, useAttrs, watch } from 'vue'
import { toggleState } from '@/utils/toggle'
import { useStore } from 'vuex'
import Sender from '@/models/Sender'
import notice from '@/utils/notice'
import ViewItem from '@/components/Page/View/Item'
import format from '@/utils/format'
import ViewPlatformZaloOA from '@/components/Page/View/Sender/Platform/Zalo/OA'
import ViewPlatformFPTSMS from '@/components/Page/View/Sender/Platform/FPT/SMS'
import ViewPlatformInfobipSMS from '@/components/Page/View/Sender/Platform/Infobip/SMS'
import { SenderPlatform } from '@/utils/enums'
import Tag from '@/components/Tag'
import IconFe from '@/components/Icon/Fe'
import DataEnum from '@/components/Page/Data/Enum'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const attrs = useAttrs()
const store = useStore()

const loading = ref(false)
const itemState = reactive(new Sender())

const ViewPlatformComponent = computed(() => {
  const mapping = {
    [SenderPlatform.ZALO_OA]: ViewPlatformZaloOA,
    [SenderPlatform.FPT_SMS]: ViewPlatformFPTSMS,
    [SenderPlatform.INFOBIP_SMS]: ViewPlatformInfobipSMS,
  }
  return mapping[itemState.platform]
})

const fetchItem = () => {
  itemState.fill(props.item)

  return store
    .dispatch('sender/DETAIL', itemState.id)
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
              'sender.type',
              'sender.platform',
            ],
          }),
        ])
      }, loading)
    }
  },
)
</script>
