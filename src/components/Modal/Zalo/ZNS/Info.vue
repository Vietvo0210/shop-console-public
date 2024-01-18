<template>
  <modal :title="'Thông tin ZNS của OA: ' + item?.name" :loading="loading" :width="500" :footer="null" mask-closable>
    <div class="flex flex-col gap-y-2">
      <div v-for="(data, key) in itemState" :key="key">
        <b class="text-indigo-500"> {{ messageTitle[key] }}</b>

        <div v-if="key === 'message_quota'" class="flex flex-col gap-y-1">
          <p v-for="(item, key) in data.data" :key="key" class="mb-0">
            · {{ messageContent[key] }} <b>{{ format.toNumber(item) }}</b>
          </p>
        </div>

        <div v-else-if="key === 'message_template_tag'" class="flex flex-col gap-y-1">
          <p v-for="(item, key) in data.data" :key="key" class="mb-0">
            · <b>{{ item }}</b>: {{ ZNSMessageTemplateTag[item] }}
          </p>
        </div>

        <div v-else-if="key === 'quality'" class="flex flex-col gap-y-1">
          <p v-for="(item, key) in data.data" :key="key" class="mb-0">
            · {{ messageContent[key] }}: <b>{{ item }}</b>
            <br />
            <span class="text-slate-500">{{ ZNSQuality[item] }}</span>
          </p>
        </div>

        <hr v-if="Object.keys(itemState).indexOf(key) < 3 && '//TODO remove v-if'" class="my-2" />
      </div>

      <div v-if="false && '//TODO remove v-if'" class="flex flex-col gap-y-2">
        <p class="mb-0">
          <b class="text-indigo-500">Mã hoá RSA khi gửi tin</b>
          <btn
            v-if="empty(rsaData)"
            :loading="fetchingRsa"
            theme="primary"
            icon="key"
            text="Lấy mã"
            class="ml-2"
            @click="onFetchRsa"
          />
        </p>
        <div class="flex flex-col" v-if="notEmpty(rsaData)">
          <text-area :value="rsaData.public_key" readonly />
          <small class="text-slate-500 mt-1">{{ rsaData.note }}</small>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  name: 'ModalZaloZnsInfo',
}
</script>

<script setup>
import Modal from '@/components/Modal'
import { reactive, ref, useAttrs, watch } from 'vue'
import { toggleState } from '@/utils/toggle'
import notice from '@/utils/notice'
import { useStore } from 'vuex'
import { ZNSMessageTemplateTag, ZNSQuality } from '@/utils/enums'
import format from '@/utils/format'
import TextArea from '@/components/TextArea'
import { empty, notEmpty } from '@/utils/variable'
import _ from 'lodash'
import Btn from '@/components/Button'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const store = useStore()
const attrs = useAttrs()

const itemState = reactive({})
const loading = ref(false)
const fetchingRsa = ref(false)
const rsaData = ref({})

const messageTitle = {
  message_quota: 'Thông tin quota ZNS',
  message_template_tag: 'Các loại nội dung ZNS có thể gửi',
  quality: 'Chất lượng gửi ZNS hiện tại',
}

const messageContent = {
  dailyQuota: 'Số tin ZNS tối đa trong 1 ngày',
  remainingQuota: 'Số tin ZNS còn lại trong ngày',
  oaCurrentQuality: 'Chất lượng gửi ZNS trong 48 giờ',
  oa7dayQuality: 'Chất lượng gửi ZNS trong 7 ngày',
}

const fetchZnsQuota = () => {
  return store
    .dispatch('sender/ZNS_QUOTA', props.item.id)
    .then(response => Object.assign(itemState, response.data))
    .catch(notice.error)
}

const fetchZnsRsa = () => {
  return store
    .dispatch('sender/ZNS_RSA', props.item.id)
    .then(response => (rsaData.value = _.pick(response.data, ['public_key', 'note'])))
    .catch(notice.error)
}

const onFetchRsa = () => {
  if (empty(rsaData.value)) {
    toggleState(fetchZnsRsa, fetchingRsa)
  }
}

watch(
  () => attrs.visible,
  visible => {
    if (visible) {
      toggleState(() => {
        return fetchZnsQuota()
      }, loading)
    }
  },
)
</script>
