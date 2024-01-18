<template>
  <a-popover trigger="click" v-model:visible="visible" class="cursor-pointer">
    <template #title>
      <span class="text-indigo-500 font-bold">Chọn OA cần xem</span>
    </template>
    <template #content>
      <div class="flex flex-col divide-y">
        <span v-for="(item, index) in list" :key="index" class="cursor-pointer py-2" @click="onShowModal(item)">{{
          item.name
        }}</span>
      </div>
    </template>
<!--    <img src="@/assets/img/icon-zalo.png" alt="Zalo" class="w-[1.25rem] h-[1.25rem]" />-->
  </a-popover>

  <modal-zalo-zns-info v-model:visible="modals.viewSender.visible" :item="selectedItem" />
</template>

<script>
export default {
  name: 'MainHeaderZaloZnsInfo',
}
</script>

<script setup>
import { useStore } from 'vuex'
import { onMounted, reactive, ref } from 'vue'
import ModalZaloZnsInfo from '@/components/Modal/Zalo/ZNS/Info'
import notice from '@/utils/notice'
import { toggleState } from '@/utils/toggle'
import { SenderType } from '@/utils/enums'

const modals = reactive({
  viewSender: {
    visible: false,
  },
})

const store = useStore()

const list = ref([])
const loading = ref(false)
const selectedItem = ref(null)
const visible = ref(false)

const onShowModal = item => {
  selectedItem.value = item
  visible.value = false
  modals.viewSender.visible = true
}

const fetchItems = () => {
  return toggleState(() => {
    return store
      .dispatch('sender/LIST', { types: [SenderType.ZALO_OA], limit: 100 })
      .then(item => (list.value = item.senders))
      .catch(notice.error)
  }, loading)
}

onMounted(() => {
  fetchItems()
})
</script>
