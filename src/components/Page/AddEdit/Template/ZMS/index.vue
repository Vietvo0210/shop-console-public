<template>
  <form-item label="Loại tin nhắn">
    <a-radio-group :options="convert2DropdownOptions(ZMSTypeEnum)" v-model:value="type" @change="onChangeType" />
  </form-item>

  <div v-if="type === ZMSType.CS" class="grid grid-cols-2 gap-4">
    <form-item :name="['message', 'type']" label="Loại tin ZMS" required>
      <pulldown :options="messageTypeCSOptions" :value="message.type" @change="v => onChangeMessageType(v)" />
    </form-item>
  </div>

  <div class="grid grid-cols-2 gap-4">
    <component :is="ViewMessageTypeComponent" :message="message" @change="onChange" class="w-[320px]" />

    <div class="text-slate-500">
      <template v-if="type === ZMSType.CS">
        <small class="block">· Người dùng từng <b>tương tác</b> trong vòng <b>7 ngày</b></small>
        <small class="block">· Chi phí: <b>55VNĐ</b>/tin nhắn (bao gồm VAT)</small>
        <small class="block">· <b>Miễn phí 8 tin nhắn</b> trong vòng <b>48 tiếng tương tác</b> của người dùng</small>
        <small class="inline-flex items-center"
          ><a
            href="https://developers.zalo.me/docs/api/official-account-api/gui-tin-va-thong-bao-qua-oa/v3/tin-tu-van/dieu-kien-gui-tin-tu-van-post-7049"
            target="_blank"
            class="inline-flex items-center gap-x-1"
            >Xem chi tiết <icon-fe type="external-link" :size="12" /> </a
        ></small>
      </template>

      <template v-else-if="type === ZMSType.TRANSACTION">
        <small class="block">· Người dùng từng <b>tương tác</b> trong vòng <b>1 năm</b></small>
        <small class="block">· Chi phí: <b>165VNĐ</b>/tin nhắn (bao gồm VAT)</small>
        <small class="inline-flex items-center"
          ><a
            href="https://developers.zalo.me/docs/api/official-account-api/gui-tin-va-thong-bao-qua-oa/v3/tin-giao-dich/dieu-kien-gui-tin-giao-dich-post-7204"
            target="_blank"
            class="inline-flex items-center gap-x-1"
            >Xem chi tiết <icon-fe type="external-link" :size="12" /> </a
        ></small>
      </template>

      <template v-else-if="type === ZMSType.PROMOTION">
        <small class="block">· Người dùng phải <b>đang quan tâm OA</b></small>
        <small class="block">· <b>Miễn phí</b> gửi tin</small>
        <small class="block">· Thời gian gửi tin: từ <b>06:00</b> đến <b>21:59</b></small>
        <small class="block">· Giới hạn mỗi ngày: <b>500 tin</b> (tối đa 5% số lượng người quan tâm)</small>
        <small class="inline-flex items-center"
          ><a
            href="https://developers.zalo.me/docs/api/official-account-api/gui-tin-va-thong-bao-qua-oa/v3/tin-truyen-thong/dieu-kien-gui-tin-truyen-thong-post-7295"
            target="_blank"
            class="inline-flex items-center gap-x-1"
            >Xem chi tiết <icon-fe type="external-link" :size="12" /> </a
        ></small>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddEditTemplateZms',
}
</script>

<script setup>
import FormItem from '@/components/Form/Item'
import { computed, provide, ref, watch } from 'vue'
import { ZMSMessageElementsDefaults, ZMSMessageType, ZMSMessageTypeCs } from '@/utils/enums'
import ViewMessageTypeText from '@/components/Page/AddEdit/Template/ZMS/Text'
import ViewMessageTypeList from '@/components/Page/AddEdit/Template/ZMS/List'
import ViewMessageTypeRequestUserInfo from '@/components/Page/AddEdit/Template/ZMS/RequestUserInfo'
import ViewMessageTypeMediaImage from '@/components/Page/AddEdit/Template/ZMS/Media/Image'
import ViewMessageTypeMediaSticker from '@/components/Page/AddEdit/Template/ZMS/Media/Sticker'
import ViewMessageTypeFile from '@/components/Page/AddEdit/Template/ZMS/File'
import ViewMessageTypeTransaction from '@/components/Page/AddEdit/Template/ZMS/Transaction'
import ViewMessageTypePromotion from '@/components/Page/AddEdit/Template/ZMS/Promotion'
import Pulldown from '@/components/Pulldown'
import { setMany } from '@/utils/collection'
import { useStore } from 'vuex'
import { convert2DropdownOptions } from '@/utils/dropdown'
import { ZMSType, ZMSTypeEnum } from '@/utils/enums'
import IconFe from '@/components/Icon/Fe'
import _ from 'lodash'
import cast from '@/utils/cast'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const store = useStore()
const emit = defineEmits(['update:message'])

const type = ref(ZMSType.TRANSACTION)
watch(
  () => props.message,
  message => {
    if (ZMSMessageTypeCs.includes(message.type)) {
      type.value = ZMSType.CS
      return
    }
    type.value = message.type
  },
)

const enumZaloZmsMessageType = computed(() => store.getters['dropdown/getEnum']('zalo.zms.message_type'))
const messageTypeCSOptions = computed(() => {
  const options = enumZaloZmsMessageType.value.filter(option => {
    return ZMSMessageTypeCs.includes(option.value)
  })
  if (cast.toDayjs('2023-06-20').isAfter()) {
    return options
  }
  return options.map(option => {
    if (option.value === ZMSMessageType.LIST) {
      option.disabled = true
    }
    return option
  })
})

const ViewMessageTypeComponent = computed(() => {
  const mapping = {
    [ZMSMessageType.TEXT]: ViewMessageTypeText,
    [ZMSMessageType.LIST]: ViewMessageTypeList,
    [ZMSMessageType.REQUEST_USER_INFO]: ViewMessageTypeRequestUserInfo,
    [ZMSMessageType.MEDIA_IMAGE]: ViewMessageTypeMediaImage,
    [ZMSMessageType.MEDIA_STICKER]: ViewMessageTypeMediaSticker,
    [ZMSMessageType.FILE]: ViewMessageTypeFile,

    [ZMSMessageType.TRANSACTION]: ViewMessageTypeTransaction,
    [ZMSMessageType.PROMOTION]: ViewMessageTypePromotion,
  }
  return mapping[props.message.type ?? ZMSMessageType.TRANSACTION]
})

const onChangeType = () => {
  let messageType = ZMSMessageType.TEXT
  if (type.value !== ZMSType.CS) {
    messageType = type.value
  }
  onChangeMessageType(messageType)
}

const onChange = values => {
  emit('update:message', setMany(props.message, values))
}
provide('onChange', onChange)

const onChangeMessageType = messageType => {
  const values = { type: messageType }

  if (type.value === ZMSType.CS) {
    values.buttons = []
    values.elements = []
    if (messageType !== ZMSMessageType.TEXT) {
      values.elements = _.cloneDeep(ZMSMessageElementsDefaults.ListV2)
    }
  } else if (!['transaction', 'promotion'].includes(props.message.type)) {
    values.elements = _.cloneDeep(ZMSMessageElementsDefaults.List)
  }

  onChange(values)
}
</script>
