<template>
  <drawer-save
    :title="(formState.exists ? 'Chỉnh sửa' : 'Thêm mới') + ' ' + Template.name"
    :mode="formState.exists ? 'update' : 'create'"
    :loading="loading"
    :submitting="submitting"
    @submit="onCreateUpdate"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <control-code v-model:value="formState.code" :readonly="formState.exists" random-prefix="T" />

        <form-item name="name" label="Tiêu đề" required>
          <a-input v-model:value="formState.name" :maxlength="255" />
        </form-item>

        <form-item name="send_mode" label="Kiểu gửi" required>
          <pulldown :options="sendModesOptions" v-model:value="formState.send_mode" @change="onChangeSendMode" />
        </form-item>

        <form-item name="sender_code" label="Người gửi tin">
          <pulldown-dynamic
            ref="senderCodeRef"
            object="sender"
            v-model:value="formState.sender_code"
            :conditions="{ send_modes: cast.toArrayAsType(formState.send_mode, Number) }"
            with-code
          />
        </form-item>
      </div>

      <template v-if="notBlank(formState.send_mode)">
        <a-divider orientation="left" class="mb-0">
          <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
            <icon-fe type="settings" />
            Cấu hình tin nhắn
          </div>
        </a-divider>

        <component :is="ViewMessageComponent" v-model:message="formState.message" />
      </template>
    </a-form>
  </drawer-save>
</template>

<script>
export default {
  name: 'AddEditTemplate',
}
</script>

<script setup>
import DrawerSave from '@/components/Drawer/Save'
import { computed, provide, reactive, ref, useAttrs, watch } from 'vue'
import Template from '@/models/Template'
import FormItem from '@/components/Form/Item'
import PulldownDynamic from '@/components/Pulldown/Dynamic'
import { fetchDropdowns } from '@/utils/dropdown'
import { validateForm } from '@/utils/form'
import { toggleState } from '@/utils/toggle'
import { useStore } from 'vuex'
import notice from '@/utils/notice'
import _ from 'lodash'
import IconFe from '@/components/Icon/Fe'
import { blank, empty, notBlank } from '@/utils/variable'
import { SendMode, ZMSMessageType } from '@/utils/enums'
import ViewTemplateZms from '@/components/Page/AddEdit/Template/ZMS'
import ViewTemplateSms from '@/components/Page/AddEdit/Template/SMS'
import cast from '@/utils/cast'
import Pulldown from '@/components/Pulldown'
import { sprintf } from 'sprintf-js'
import ControlCode from '@/components/Page/Control/Code'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const store = useStore()
const attrs = useAttrs()
const emit = defineEmits(['ok'])

const formRef = ref(null)
const formState = reactive(new Template())
const loading = ref(false)
const submitting = ref(false)
const senderCodeRef = ref(null)

const errors = ref({})
provide('errors', errors)

const enumMessageSendMode = computed(() => store.getters['dropdown/getEnum']('message.send_mode'))
const sendModesOptions = computed(() => _.reject(enumMessageSendMode.value, ['value', SendMode.ZNS]))

const ViewMessageComponent = computed(() => {
  const mapping = {
    [SendMode.ZMS]: ViewTemplateZms,
    [SendMode.SMS]: ViewTemplateSms,
  }
  return mapping[formState.send_mode]
})

const onChangeSendMode = sendMode => {
  const mapping = {
    [SendMode.ZMS]: {
      type: ZMSMessageType.TRANSACTION,
      text: null,
      elements: [],
      buttons: [],
    },
    [SendMode.ZNS]: null,
    [SendMode.SMS]: {
      text: null,
    },
  }
  return mapping[sendMode]
}

const fetchItem = () => {
  formState.fill(props.item)

  if (formState.id) {
    return toggleState(() => {
      return store
        .dispatch('template/DETAIL', formState.id)
        .then(item => formState.fill(item))
        .catch(notice.error)
    }, loading)
  }
}

const onCreateUpdate = () => {
  const validateCustom = new Promise((resolve, reject) => {
    // Skip validate SMS
    if (formState.send_mode === SendMode.SMS) {
      return resolve()
    }

    const type = formState.message.type ?? 'text'
    const e = {}

    // Validate images
    const elements = formState.message.elements ?? []
    let checkElementIndex = null
    if (['transaction', 'promotion'].includes(type)) {
      checkElementIndex = _.findIndex(elements, ['type', 'banner'])
    } else if (type !== 'text') {
      checkElementIndex = 0
    }
    if (checkElementIndex !== null) {
      const checkElement = elements[checkElementIndex]
      if (blank(checkElement.image_url)) {
        e[`message.elements.${checkElementIndex}.image_url`] = sprintf(
          'Hình ảnh %sphải là bắt buộc',
          checkElementIndex > 0 ? `phần tử ${checkElementIndex} ` : '',
        )
      }
    }

    // Validate first key of table rows
    if (['transaction', 'promotion'].includes(type)) {
      const elementTableIndex = _.findIndex(elements, ['type', 'table'])
      const firstKey = elements[elementTableIndex].content[0].key
      if (!firstKey.startsWith('Mã') && firstKey !== 'Tên khách hàng') {
        e[`message.elements.${elementTableIndex}.content.0.key`]
          = 'Thuộc tính dòng 1 phải bắt đầu bằng "Mã" hoặc chính xác là "Tên khách hàng"'
      }
    }

    // Validate button actions
    if (type === 'text') {
      const buttons = formState.message.buttons ?? []
      buttons.forEach((button, index) => {
        if (blank(button.type) || blank(button.payload)) {
          e[`message.buttons.${index}.action`] = 'Hành động phải là bắt buộc'
        }
      })
    }

    if (empty(e)) {
      return resolve()
    }
    errors.value = e
    return reject()
  })

  validateForm(
    formRef.value,
    () => {
      return toggleState(() => {
        return store
          .dispatch('template/' + (formState.exists ? 'UPDATE' : 'CREATE'), formState)
          .then(response => {
            notice.success(response.message)
            emit('ok', Template.make(response.data.template))
          })
          .catch(({ message, errors: e }) => {
            notice.error(message)
            errors.value = e
          })
      }, submitting)
    },
    validateCustom,
  )
}

watch(
  () => formState.send_mode,
  () => fetchDropdowns(senderCodeRef.value),
)

watch(
  () => attrs.visible,
  visible => {
    if (visible) {
      formRef.value?.clearValidate()
      errors.value = {}

      toggleState(() => {
        return Promise.all([
          fetchItem(),
          store.dispatch('dropdown/LIST', {
            objects: [
              'message.send_mode',
              'zalo.zms.message_type',
            ],
          }),
        ])
      }, loading)
    }
  },
)
</script>
