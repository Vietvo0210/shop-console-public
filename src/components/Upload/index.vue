<template>
  <div>
    <component
      ref="uploadRef"
      :is="'AUpload' + (dragger ? 'Dragger' : '')"
      :max-count="multiple ? null : 1"
      :multiple="multiple"
      :file-list="fileList"
      :before-upload="onBeforeUpload"
      :custom-request="onUpload"
      v-bind="$attrs"
      @remove="onRemove"
    >
      <template v-if="dragger">
        <p class="ant-upload-drag-icon">
          <icon-fe type="upload" :size="32" class="text-indigo-500" />
        </p>
        <p class="ant-upload-text text-slate-500">{{ uploadText }}</p>
        <a
          v-if="notBlank(sampleFile)"
          :href="_.isObject(sampleFile) ? sampleFile.url : sampleFile"
          class="inline-flex items-center text-xs gap-x-1 mx-auto"
          :download="_.isObject(sampleFile) ? sampleFile.name : sampleFile"
          @click.stop
        >
          <icon-fe type="download" :size="12" />
          <span>Tải file mẫu</span>
        </a>
      </template>
      <slot v-else-if="$slots.default" />
      <btn v-else theme="primary" icon="upload" text="Chọn file..." />
    </component>

    <div v-if="uploading" class="mt-2">
      <a-progress size="small" :percent="uploadProgress" />
      <div class="flex items-center gap-x-1">
        <a-spin size="small" />
        <span class="text-primary">Đang tải lên...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  inheritAttrs: false,
}
</script>

<script setup>
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, useAttrs, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { toggleState } from '@/utils/toggle'
import { ifBlank, notBlank } from '@/utils/variable'
import _ from 'lodash'
import notice from '@/utils/notice'
import cast from '@/utils/cast'
import IconFe from '@/components/Icon/Fe'
import Btn from '@/components/Button'

const props = defineProps({
  dragger: {
    type: Boolean,
    default: true,
  },
  uploadText: {
    type: String,
    default: 'Ấn để chọn, hoặc kéo thả file vào đây',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  value: {
    type: [Array, String],
    default: '',
  },
  originName: {
    type: [Array, String],
    default: '',
  },
  dir: {
    type: String,
    default: 'uploads',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  uploadDispatch: {
    type: String,
    default: 'upload/UPLOAD',
  },
  sampleFile: {
    type: [String, Object],
  },
})

const emit = defineEmits(['update:value', 'update:originName', 'change'])

const router = useRouter()
const store = useStore()
const attrs = useAttrs()

const fileList = computed(() => {
  const values = cast.toArray(props.value)
  const originNames = cast.toArray(props.originName)

  return values.map((value, index) => {
    const name = ifBlank(originNames[index], value.split('/').pop())
    return {
      uid: uuidv4(),
      name,
      thumbUrl: value,
      url: value,
      status: 'done',
      percent: 100,
    }
  })
})

const uploadRef = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const selectedFileUid = ref(null)

const onBeforeUpload = (file, fileList) => {
  let value
  if (props.multiple) {
    value = _.concat(cast.toArray(props.value), _.map(fileList, 'name'))
    selectedFileUid.value = _.concat(cast.toArray(selectedFileUid.value), _.map(fileList, 'uid'))
  } else {
    value = file.name
    selectedFileUid.value = file.uid
  }
  emit('update:value', value)
}

const onUpload = ({ file, onProgress, onSuccess, onError }) => {
  uploadProgress.value = 0
  const onProgressCustom = percent => {
    uploadProgress.value = Math.round(percent)
    return onProgress(percent)
  }

  return toggleState(() => {
    return store
      .dispatch(props.uploadDispatch, {
        file,
        dir: props.dir,
        is_public: cast.toNumber(props.isPublic),
        onProgress: onProgressCustom,
      })
      .then(({ data }) => {
        let value = data.filename
        if (props.isPublic) {
          value = data.url
        }
        let originName = data.origin_filename

        if (props.multiple) {
          const fileIndex = _.indexOf(selectedFileUid.value, file.uid)
          value = _.set(props.value, fileIndex, value)
          originName = _.set(cast.toArray(props.originName), fileIndex, originName)
        }

        emit('update:value', value)
        emit('update:originName', originName)
        emit('change', data)
        return data
      })
      .then(onSuccess)
      .catch(message => {
        onRemove()
        notice.error(message)
        return onError(message)
      })
  }, uploading)
}

const onRemove = () => {
  emit('update:value', null)
  emit('change', null)
  selectedFileUid.value = null
}

watch(uploading, state => {
  const uploadList = document.getElementsByClassName('ant-upload-list')
  uploadList[0].style.display = state ? 'none' : 'block'
})

defineExpose({
  click: () => {
    uploadRef.value.$el.querySelector('input[type="file"]').click()
  },
})
</script>
