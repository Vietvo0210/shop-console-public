<template>
  <modal title="Chọn hành động" hidden-cancel-button @ok="onOk">
    <a-form ref="formRef" :model="formState" layout="vertical" class="flex flex-col gap-y-2">
      <form-item name="type" label="Loại hành động" :required="type === 'button'">
        <pulldown
          :allow-clear="false"
          :options="convert2DropdownOptions(ZMSMessageActionEnum)"
          v-model:value="formState.type"
          @change="onChangeType"
        />
      </form-item>

      <form-item
        v-if="formState.type === ZMSMessageAction.OPEN_URL"
        :name="formNameUrl"
        label="URL trang web"
        :rules="{ type: 'url', required: true }"
      >
        <text-area
          :auto-size="{ minRows: 2 }"
          :value="_.get(formState, formAttrUrl)"
          placeholder="https://"
          @change="_.set(formState, formAttrUrl, $event.target.value)"
        />
      </form-item>

      <div
        v-else-if="[ZMSMessageAction.QUERY_SHOW, ZMSMessageAction.QUERY_HIDE].includes(formState.type)"
        class="flex flex-col gap-y-2"
      >
        <element-simple-text
          name="payload"
          v-model:value="formState.payload"
          :input-props="{ placeholder: 'Ví dụ: Xin chào, tôi cần trợ giúp!' }"
          required
        />
        <p v-if="formState.type === ZMSMessageAction.QUERY_HIDE" class="text-slate-500 mb-0">
          <small>Tin nhắn sẽ không hiển thị trong ô chat của người dùng</small>
        </p>
      </div>

      <div
        v-else-if="[ZMSMessageAction.OPEN_SMS, ZMSMessageAction.OPEN_PHONE].includes(formState.type)"
        class="flex flex-col gap-y-2"
      >
        <form-item
          :name="['payload', 'phone_code']"
          label="Số điện thoại quản trị viên"
          :rules="{
            validator: formState.type === ZMSMessageAction.OPEN_SMS ? validatePhoneNumber : validateMobileNumber,
            trigger: 'change',
          }"
          required
        >
          <a-input type="tel" v-model:value="formState.payload.phone_code" />
        </form-item>

        <element-simple-text
          v-if="formState.type === ZMSMessageAction.OPEN_SMS"
          :name="['payload', 'content']"
          v-model:value="formState.payload.content"
          :input-props="{ placeholder: 'Ví dụ: Xin chào, tôi cần trợ giúp!' }"
          required
        />
      </div>
    </a-form>
  </modal>
</template>

<script>
import _ from 'lodash'
import { ZMSMessageAction, ZMSMessageActionEnum } from '@/utils/enums'
import { h } from 'vue'

export const getActionLabel = (option, type = 'element') => {
  const children = []
  let prefix = ''
  if (type === 'element') {
    prefix = 'default_action.'
  }

  const actionType = _.get(option, prefix + 'type', '')
  children.push(ZMSMessageActionEnum[actionType])

  if (actionType === ZMSMessageAction.OPEN_URL) {
    if (type === 'button') {
      prefix += 'payload.'
    }
    const url = _.get(option, prefix + 'url')
    children.push(' ', h('a', { href: url, target: '_blank' }, url))
  } else if ([ZMSMessageAction.QUERY_SHOW, ZMSMessageAction.QUERY_HIDE].includes(actionType)) {
    const payload = _.get(option, prefix + 'payload')
    children.push(' với nội dung: ', h('b', payload))
  } else if ([ZMSMessageAction.OPEN_SMS, ZMSMessageAction.OPEN_PHONE].includes(actionType)) {
    const phone = _.get(option, prefix + 'payload.phone_code')
    children.push(' tới SĐT ', h('a', { href: `tel:${phone}` }, phone))

    if (actionType === ZMSMessageAction.OPEN_SMS) {
      const content = _.get(option, prefix + 'payload.content')
      children.push(' với nội dung: ', h('b', content))
    }
  }

  return h('span', children)
}

export default {
  name: 'ModalZaloZmsSelectAction',
}
</script>

<script setup>
import Modal from '@/components/Modal'
import FormItem from '@/components/Form/Item'
import Pulldown from '@/components/Pulldown'
import ElementSimpleText from '@/components/Page/AddEdit/Template/Element/SimpleText'
import { convert2DropdownOptions } from '@/utils/dropdown'
import { computed, reactive, ref, useAttrs, watch } from 'vue'
import { validateForm } from '@/utils/form'
import { validatePhoneNumber, validateMobileNumber } from '@/utils/validator'
import { blank } from '@/utils/variable'
import TextArea from '@/components/TextArea'

const props = defineProps({
  type: {
    type: String,
    default: 'element',
    validator(value) {
      return ['element', 'button'].includes(value)
    },
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const attrs = useAttrs()
const emit = defineEmits(['ok'])

const defaultFormState = Object.freeze({
  type: '',
  url: null,
  payload: null,
})
const formState = reactive(_.cloneDeep(defaultFormState))
const formRef = ref(null)

const formNameUrl = computed(() => {
  const name = ['url']
  if (props.type === 'button') {
    name.unshift('payload')
  }
  return name
})

const formAttrUrl = computed(() => {
  let attr = 'url'
  if (props.type === 'button') {
    attr = 'payload.' + attr
  }
  return attr
})

const onChangeType = type => {
  if (type === ZMSMessageAction.OPEN_URL && props.type === 'element') {
    _.unset(formState, 'payload')
    formState.url = null
    return
  }

  _.unset(formState, 'url')
  if ([ZMSMessageAction.QUERY_SHOW, ZMSMessageAction.QUERY_HIDE].includes(type)) {
    formState.payload = null
  }
  if ([ZMSMessageAction.OPEN_SMS, ZMSMessageAction.OPEN_PHONE].includes(type)) {
    formState.payload = {}
  }
}

const onOk = () => {
  let action = _.cloneDeep(formState)
  if (blank(action.type)) {
    action = null
  }
  validateForm(formRef.value, () => emit('ok', action))
}

watch(
  () => attrs.visible,
  visible => {
    if (visible) {
      formRef.value?.clearValidate()
      Object.assign(formState, _.cloneDeep(defaultFormState), props.options)
    }
  },
)
</script>
