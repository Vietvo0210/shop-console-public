<template>
  <component :is="MessageTypeComponent" :template="template" />
</template>

<script>
export default {
  name: 'ViewMessageZms',
}
</script>

<script setup>
import { computed } from 'vue'
import { ZMSMessageType } from '@/utils/enums'
import ViewMessageZmsText from '@/components/Page/View/Message/ZMS/Text'
import ViewMessageZmsList from '@/components/Page/View/Message/ZMS/List'
import ViewMessageZmsRequestUserInfo from '@/components/Page/View/Message/ZMS/RequestUserInfo'
import ViewMessageZmsMediaImage from '@/components/Page/View/Message/ZMS/Media/Image'
import ViewMessageZmsMediaSticker from '@/components/Page/View/Message/ZMS/Media/Sticker'
import ViewMessageZmsFile from '@/components/Page/View/Message/ZMS/File'
import ViewMessageZmsTransaction from '@/components/Page/View/Message/ZMS/Transaction'
import ViewMessageZmsPromotion from '@/components/Page/View/Message/ZMS/Promotion'

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
})

const MessageTypeComponent = computed(() => {
  const mapping = {
    [ZMSMessageType.TEXT]: ViewMessageZmsText,
    [ZMSMessageType.LIST]: ViewMessageZmsList,
    [ZMSMessageType.REQUEST_USER_INFO]: ViewMessageZmsRequestUserInfo,
    [ZMSMessageType.MEDIA_IMAGE]: ViewMessageZmsMediaImage,
    [ZMSMessageType.MEDIA_STICKER]: ViewMessageZmsMediaSticker,
    [ZMSMessageType.FILE]: ViewMessageZmsFile,

    [ZMSMessageType.TRANSACTION]: ViewMessageZmsTransaction,
    [ZMSMessageType.PROMOTION]: ViewMessageZmsPromotion,
  }
  return mapping[props.template.message?.type]
})
</script>
