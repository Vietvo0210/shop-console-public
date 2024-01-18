<template>
  <drawer-save
    :title="(formState.exists ? 'Chỉnh sửa' : 'Thêm mới') + ' ' + Sender.name"
    :mode="formState.exists ? 'update' : 'create'"
    :loading="loading"
    :submitting="submitting"
    @submit="onCreateUpdate"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <control-code v-model:value="formState.code" :readonly="formState.exists" random-prefix="S" />

        <form-item name="name" label="Tên" required>
          <a-input v-model:value="formState.name" :maxlength="255" />
        </form-item>

        <form-item name="type" label="Loại" required>
          <pulldown-dynamic ref="typeRef" object="sender.type" v-model:value="formState.type" />
        </form-item>

        <form-item name="platform" label="Nền tảng" required>
          <pulldown-dynamic
            ref="platformRef"
            object="sender.platform"
            v-model:value="formState.platform"
            :conditions="{ types: cast.toArrayAsType(formState.type, Number) }"
          />
        </form-item>
      </div>

      <template v-if="notBlank(formState.platform)">
        <a-divider orientation="left" class="mb-0">
          <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
            <icon-fe type="settings" />
            Thông tin cấu hình
          </div>
        </a-divider>

        <component :is="PlatformComponent" v-model:info="formState.info" />
      </template>
    </a-form>
  </drawer-save>
</template>

<script>
export default {
  name: 'AddEditSender',
}
</script>

<script setup>
import DrawerSave from '@/components/Drawer/Save'
import { computed, provide, reactive, ref, useAttrs, watch } from 'vue'
import Sender from '@/models/Sender'
import FormItem from '@/components/Form/Item'
import PulldownDynamic from '@/components/Pulldown/Dynamic'
import { fetchDropdowns } from '@/utils/dropdown'
import { validateForm } from '@/utils/form'
import { toggleState } from '@/utils/toggle'
import { useStore } from 'vuex'
import notice from '@/utils/notice'
import cast from '@/utils/cast'
import PlatformZaloOa from '@/components/Page/AddEdit/Sender/Zalo/OA'
import PlatformFptSms from '@/components/Page/AddEdit/Sender/FPT/SMS'
import PlatformInfobipSms from '@/components/Page/AddEdit/Sender/Infobip/SMS'
import IconFe from '@/components/Icon/Fe'
import { notBlank } from '@/utils/variable'
import { SenderPlatform } from '@/utils/enums'
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
const formState = reactive(new Sender())
const loading = ref(false)
const submitting = ref(false)
const typeRef = ref(null)
const platformRef = ref(null)

const errors = ref({})
provide('errors', errors)

const PlatformComponent = computed(() => {
  const mapping = {
    [SenderPlatform.ZALO_OA]: PlatformZaloOa,
    [SenderPlatform.FPT_SMS]: PlatformFptSms,
    [SenderPlatform.INFOBIP_SMS]: PlatformInfobipSms,
  }
  return mapping[formState.platform]
})

const fetchItem = () => {
  formState.fill(props.item)

  if (formState.id) {
    return toggleState(() => {
      return store
        .dispatch('sender/DETAIL', formState.id)
        .then(item => formState.fill(item))
        .catch(notice.error)
    }, loading)
  }
}

const onCreateUpdate = () => {
  validateForm(formRef.value, () => {
    return toggleState(() => {
      return store
        .dispatch('sender/' + (formState.exists ? 'UPDATE' : 'CREATE'), formState)
        .then(response => {
          notice.success(response.message)
          emit('ok', Sender.make(response.data.sender))
        })
        .catch(({ message, errors: e }) => {
          notice.error(message)
          errors.value = e
        })
    }, submitting)
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
          fetchDropdowns(typeRef.value),
        ])
      }, loading)
    }
  },
)

watch(
  () => formState.type,
  () => fetchDropdowns(platformRef.value),
)
</script>
