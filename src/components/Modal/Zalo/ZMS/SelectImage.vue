<template>
  <modal title="Chọn hình ảnh" hidden-cancel-button @ok="onOk">
    <a-form ref="formRef" :model="formState" layout="vertical" class="flex flex-col gap-y-2">
      <form-item name="type">
        <a-radio-group
          :options="convert2DropdownOptions(ZMSSelectImageTypeEnum, true)"
          v-model:value="formState.type"
          @change="onChangeType"
        />
      </form-item>

      <form-item :name="field" label="URL ảnh" :show-label="false" :required="required">
        <template v-if="formState.type === ZMSSelectImageType.URL">
          <text-area
            v-model:value="formState[field]"
            :auto-size="{ minRows: 4 }"
            placeholder="Sao chép và dán URL ảnh vào đây"
          />
          <a-image :src="formState[field]" :preview="false" wrapper-class-name="mt-2" />
        </template>
        <upload-image v-else v-model:value="formState[field]" />
      </form-item>
    </a-form>
  </modal>
</template>

<script>
export default {
  name: 'ModalZaloZmsSelectImage',
}
</script>

<script setup>
import Modal from '@/components/Modal'
import { reactive, ref, useAttrs, watch } from 'vue'
import { validateForm } from '@/utils/form'
import { ZMSSelectImageType, ZMSSelectImageTypeEnum } from '@/utils/enums'
import UploadImage from '@/components/Upload/Image'
import FormItem from '@/components/Form/Item'
import { blank } from '@/utils/variable'
import { convert2DropdownOptions } from '@/utils/dropdown'
import TextArea from '@/components/TextArea'

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    default: 'image_url',
  },
  required: {
    type: Boolean,
    default: true,
  },
})

const attrs = useAttrs()
const emit = defineEmits(['ok'])

const formState = reactive({
  type: ZMSSelectImageType.UPLOAD,
  [props.field]: '',
})
const formRef = ref(null)

const onChangeType = () => {
  if (formState.type === ZMSSelectImageType.URL) {
    formState[props.field] = ''
  }
}

const onOk = () => {
  validateForm(formRef.value, () => emit('ok', formState[props.field]))
}

watch(
  () => attrs.visible,
  visible => {
    if (visible) {
      formRef.value?.clearValidate()
      Object.assign(formState, {
        type: blank(props.imageUrl) ? ZMSSelectImageType.UPLOAD : ZMSSelectImageType.URL,
        [props.field]: props.imageUrl,
      })
    }
  },
)
</script>
