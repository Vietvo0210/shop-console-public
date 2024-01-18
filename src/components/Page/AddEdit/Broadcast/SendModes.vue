<template>
  <a-divider orientation="left" class="mb-0">
    <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
      <icon-fe type="settings" />
      Cấu hình kịch bản gửi
    </div>
  </a-divider>

  <tbl :data-source="item.send_modes" :pagination="false" sticky>
    <tbl-col title="Thứ tự" :width="80" fixed="left" align="center">
      <template #default="{ index }">
        <a-badge :count="index + 1" :number-style="{ background: '#6366f1' }" />
      </template>
    </tbl-col>
    <tbl-col :width="200" fixed="left">
      <template #title>
        <span class="required">Kiểu gửi</span>
      </template>
      <template #default="{ index }">
        <form-item :name="['send_modes', index]" label="Kiểu gửi" :show-label="false" required>
          <pulldown
            :options="enumMessageSendMode"
            :value="item.send_modes[index]"
            :disabled="empty(enumMessageSendMode)"
            @change="v => onChangeSendMode(v, index)"
          />
        </form-item>
      </template>
    </tbl-col>
    <tbl-col :width="200">
      <template #title>
        <span class="required">Người gửi tin</span>
      </template>
      <template #default="{ index }">
        <form-item :name="['sender_codes', index]" label="Người gửi tin" :show-label="false" required>
          <pulldown
            :options="senderCodesOptions[index]"
            :value="item.sender_codes[index]"
            :disabled="disabledSenderCodes[index]"
            with-code
            @change="v => onChangeSenderCode(v, index)"
          />
        </form-item>
      </template>
    </tbl-col>
    <tbl-col :width="200">
      <template #title>
        <span class="required">Mẫu tin</span>
      </template>
      <template #default="{ index }">
        <form-item :name="['template_codes', index]" label="Mẫu tin" :show-label="false" required>
          <pulldown
            :options="templateCodesOptions[index]"
            :value="item.template_codes[index]"
            :disabled="disabledTemplateCodes[index]"
            with-code
            @change="v => onChangeTemplateCode(v, index)"
          />
        </form-item>
      </template>
    </tbl-col>
    <tbl-col v-if="item.send_modes.length > 1" :width="60" fixed="right" align="center">
      <template #default="{ index }">
        <div class="flex justify-center gap-2">
          <btn-delete only-icon tooltip="Xóa" @click="onRemoveSendMode(index)" />
        </div>
      </template>
    </tbl-col>
  </tbl>
  <div>
    <btn-add text="Thêm kiểu gửi" @click="onAddSendMode" />
  </div>
</template>

<script>
export default {
  name: 'BroadcastSendModes',
}
</script>

<script setup>
import Pulldown from '@/components/Pulldown'
import FormItem from '@/components/Form/Item'
import Tbl from '@/components/Table'
import TblCol from '@/components/Table/Column'
import BtnDelete from '@/components/Button/Delete'
import IconFe from '@/components/Icon/Fe'
import _ from 'lodash'
import { computed, ref } from 'vue'
import cast from '@/utils/cast'
import { useStore } from 'vuex'
import BtnAdd from '@/components/Button/Add'
import { removeArrayIndex } from '@/utils/collection'
import { empty, notBlank } from '@/utils/variable'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const store = useStore()
const emit = defineEmits(['change'])

const senderCodesOptions = ref([])
const templateCodesOptions = ref([])
const disabledTemplateCodes = ref([])
const disabledSenderCodes = ref([])

const enumMessageSendMode = computed(() => store.getters['dropdown/getEnum']('message.send_mode'))

const onAddSendMode = () => {
  emit('change', {
    send_modes: _.concat(props.item.send_modes, null),
    template_codes: _.concat(props.item.template_codes, null),
    sender_codes: _.concat(props.item.sender_codes, null),
    mapping_params: _.concat(props.item.mapping_params, {}),
  })
}

const fetchSenderCodesOptions = (sendMode, index) => {
  return Promise.resolve()
    .then(() => disabledSenderCodes.value[index] = true)
    .then(() => {
      return store
        .dispatch('dropdown/LIST', {
          objects: ['sender'],
          send_modes: cast.toArrayAsType(sendMode, Number),
        })
        .then(options => {
          senderCodesOptions.value[index] = options.sender
        })
    })
    .then(() => disabledSenderCodes.value[index] = false)
}

const fetchTemplateCodesOptions = (senderCode, index) => {
  return Promise.resolve()
    .then(() => disabledTemplateCodes.value[index] = true)
    .then(() => {
      return store
        .dispatch('dropdown/LIST', {
          objects: ['template'],
          send_modes: cast.toArrayAsType(props.item.send_modes?.[index], Number),
          sender_codes: cast.toArrayAsType(senderCode, String),
        })
        .then(options => {
          templateCodesOptions.value[index] = options.template
        })
    })
    .then(() => disabledTemplateCodes.value[index] = false)
}

const onChangeSendMode = (sendMode, index) => {
  emit('change', {
    [`send_modes.${index}`]: sendMode,
    [`template_codes.${index}`]: null,
    [`sender_codes.${index}`]: null,
    [`mapping_params.${index}`]: {},
  })

  senderCodesOptions.value[index] = []
  if (notBlank(sendMode)) {
    fetchSenderCodesOptions(sendMode, index)
  }
}

const onRemoveSendMode = index => {
  emit('change', {
    send_modes: removeArrayIndex(props.item.send_modes, index),
    template_codes: removeArrayIndex(props.item.template_codes, index),
    sender_codes: removeArrayIndex(props.item.sender_codes, index),
    mapping_params: removeArrayIndex(props.item.mapping_params, index),
  })
  removeArrayIndex(senderCodesOptions.value, index)
}

const onChangeSenderCode = (senderCode, index) => {
  emit('change', {
    [`sender_codes.${index}`]: senderCode,
    [`template_codes.${index}`]: null,
  })

  if (notBlank(senderCode)) {
    fetchTemplateCodesOptions(senderCode, index)
  }
}

const onChangeTemplateCode = (templateCode, index) => {
  emit('change', { [`template_codes.${index}`]: templateCode })
}

defineExpose({
  fetchSenderCodesOptions,
  fetchTemplateCodesOptions,
})
</script>
