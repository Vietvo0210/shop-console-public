<template>
  <drawer-save
    :title="(formState._is_copy ? 'Sao chép' : 'Thêm mới') + ' ' + Broadcast.name"
    :mode="formState.exists ? 'update' : 'create'"
    :loading="loading"
    :submitting="submitting"
    :width="1140"
    :submit-props="{ icon: 'send', text: 'Gửi' }"
    @submit="onCreateUpdate"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <control-code v-model:value="formState.code" :readonly="formState.exists" random-prefix="B" />

        <form-item name="title" label="Tiêu đề" required>
          <a-input v-model:value="formState.title" :maxlength="255" />
        </form-item>

        <form-item name="recipient_collection_id" label="Tập người nhận tin" required>
          <pulldown-dynamic
            ref="reCollectionIdRef"
            object="recipient_collection"
            v-model:value="formState.recipient_collection_id"
            :conditions="{
              types: [RecipientCollectionType.IMPORT],
              statuses: [RecipientCollectionStatus.DONE],
            }"
            with-code
            @change="onChangeReCollectionId"
          >
            <template #extra="{ recipients_count: recipientsCount }">
              <small class="text-slate-500">({{ format.toNumber(recipientsCount) }} người nhận)</small>
            </template>
          </pulldown-dynamic>
        </form-item>

        <form-item name="schedule_send_at" label="Thời gian gửi dự kiến">
          <date-picker v-model:value="formState.schedule_send_at" placeholder="Gửi ngay lập tức" show-time />
          <small v-if="blank(formState.schedule_send_at)" class="text-slate-500 mb-0">Không chọn trường này, để gửi ngay
            lập tức</small>
        </form-item>
      </div>

      <broadcast-send-modes ref="sendModesRef" :item="formState" @change="onChangeSendModes" />

      <template v-for="(sendMode, index) in formState.send_modes" :key="index">
        <broadcast-mapping-params
          v-if="reCollFileDefinition && notBlank(sendMode) && notBlank(selectedTemplates?.[index])"
          :index="index"
          :file-definition="reCollFileDefinition"
          :send-mode="sendMode"
          :template="selectedTemplates[index]"
          v-model:mapping-param="formState.mapping_params[index]"
          v-model:info="formState.info"
        />
      </template>
    </a-form>
  </drawer-save>
</template>

<script>
export default {
  name: 'AddEditBroadcast',
}
</script>

<script setup>
import DrawerSave from '@/components/Drawer/Save'
import DatePicker from '@/components/DatePicker'
import { h, provide, reactive, ref, useAttrs, watch } from 'vue'
import Broadcast from '@/models/Broadcast'
import FormItem from '@/components/Form/Item'
import PulldownDynamic from '@/components/Pulldown/Dynamic'
import { validateForm } from '@/utils/form'
import { toggleState } from '@/utils/toggle'
import { useStore } from 'vuex'
import { blank, empty, notBlank } from '@/utils/variable'
import notice from '@/utils/notice'
import { showConfirm } from '@/utils/confirm'
import { WarningOutlined } from '@ant-design/icons-vue'
import { RecipientCollectionStatus, RecipientCollectionType } from '@/utils/enums'
import format from '@/utils/format'
import BroadcastSendModes from '@/components/Page/AddEdit/Broadcast/SendModes'
import BroadcastMappingParams from '@/components/Page/AddEdit/Broadcast/MappingParams'
import { fetchDropdowns, getDropdownProp } from '@/utils/dropdown'
import Template from '@/models/Template'
import _ from 'lodash'
import ControlCode from '@/components/Page/Control/Code'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  isCopy: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()
const attrs = useAttrs()
const emit = defineEmits(['ok'])

const formRef = ref(null)
const formState = reactive(new Broadcast())
const loading = ref(false)
const submitting = ref(false)
const reCollectionIdRef = ref(null)
const selectedTemplates = ref([])
const reCollFileDefinition = ref(null)
const sendModesRef = ref(null)

const errors = ref({})
provide('errors', errors)

const onChangeReCollectionId = reCollectionId => {
  reCollFileDefinition.value = getDropdownProp(
    reCollectionIdRef.value.getState('options'),
    reCollectionId,
    'file_definition',
  )
}

const onChangeSendModes = values => {
  formState.fill(values)

  selectedTemplates.value = []
  const templateCodes = formState.template_codes.filter(notBlank)
  if (empty(templateCodes)) {
    return
  }

  const oldTemplateCodes = _.map(selectedTemplates.value, 'code')
  const changedTemplateCodes = JSON.stringify(templateCodes) !== JSON.stringify(oldTemplateCodes)
  if (changedTemplateCodes) {
    const query = {
      codes: templateCodes,
      limit: templateCodes.length,
    }
    return store
      .dispatch('template/LIST', query)
      .then(data => {
        templateCodes.forEach(code => {
          selectedTemplates.value.push(_.find(data.templates, ['code', code]))
        })
      })
      .catch(notice.error)
  }
}

const fetchSendModes = () => {
  const reCollectionId = formState.recipient_collection_id
  if (notBlank(reCollectionId)) {
    onChangeReCollectionId(reCollectionId)
  }

  formState.send_modes.forEach((sendMode, index) => {
    if (notBlank(sendMode)) {
      sendModesRef.value.fetchSenderCodesOptions(sendMode, index)

      const senderCode = _.get(formState.sender_codes, index)
      if (notBlank(senderCode)) {
        sendModesRef.value.fetchTemplateCodesOptions(senderCode, index)
      }
    }
  })
}

const fetchItem = () => {
  return formState.fill(_.omit(props.item, ['id', 'code', 'schedule_send_at']))
}

const onCreateUpdate = () => {
  validateForm(formRef.value, () => {
    let scheduleSentAtText = 'Ngay lập tức'
    if (notBlank(formState.schedule_send_at)) {
      scheduleSentAtText = format.toDatetime(formState.schedule_send_at)
    }

    showConfirm({
      title: h('b', 'Xác nhận gửi hàng loạt'),
      icon: h(WarningOutlined, { class: 'text-indigo-500' }),
      content: h('p', ['Bạn có chắc chắn muốn hàng loạt không?', h('br'), `Dự kiến gửi: ${scheduleSentAtText}`]),
      onOk() {
        toggleState(() => {
          return store
            .dispatch('broadcast/' + (formState.exists ? 'UPDATE' : 'CREATE'), formState)
            .then(response => {
              notice.success(response.message)
              emit('ok', Broadcast.make(response.data.broadcast))
            })
            .catch(({ message, errors: e }) => {
              notice.error(message)
              errors.value = e
            })
        }, submitting)
      },
    })
  })
}

watch(
  () => attrs.visible,
  visible => {
    if (visible) {
      formRef.value?.clearValidate()
      errors.value = {}

      toggleState(() => {
        return Promise.all([
          fetchItem(),
          onChangeSendModes(),
          fetchDropdowns(reCollectionIdRef.value).then(fetchSendModes),
          store.dispatch('dropdown/LIST', {
            objects: [
              'message.send_mode',
              'broadcast.mapping_param.type',
              'broadcast.mapping_param.end_user_property',
            ],
          }),
        ])
      }, loading)
    }
  },
)
</script>
