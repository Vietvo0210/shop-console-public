<template>
  <drawer-save :title="'Import ' + RecipientCollection.name" mode="import" :loading="loading" @submit="onImport">
    <a-form ref="formRef" :model="formState" layout="vertical" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <control-code v-model:value="formState.code" :readonly="formState.exists" random-prefix="RC" />

        <form-item name="name" label="Tên" required>
          <a-input v-model:value="formState.name" :maxlength="255" />
        </form-item>
      </div>

      <form-item name="filepath" label="File tập người nhận tin" required>
        <upload
          dir="import/recipient_collection"
          v-model:value="formState.filepath"
          v-model:origin-name="formState.filename"
          :sample-file="{ name: 'file-mau-import-tap-nguoi-nhan-tin.xlsx', url: SAMPLE_FILE_URL }"
          accept=".txt,.csv,.tsv,.xls,.xlsx"
          @change="onChangeFile"
        />
        <small class="text-slate-500">Có thể sử dụng định dạng: excel, txt, csv, tsv</small>
      </form-item>

      <import-file-definition
        v-if="formState.file_definition?.total_row > 0"
        v-model:file-definition="formState.file_definition"
      />
    </a-form>
  </drawer-save>
</template>

<script>
export default {
  name: 'ImportRecipientCollection',
}
</script>

<script setup>
import DrawerSave from '@/components/Drawer/Save'
import RecipientCollection from '@/models/RecipientCollection'
import { provide, reactive, ref, useAttrs, watch } from 'vue'
import { useStore } from 'vuex'
import FormItem from '@/components/Form/Item'
import Upload from '@/components/Upload'
import ImportFileDefinition from '@/components/Page/Import/RecipientCollection/FileDefinition'
import { validateForm } from '@/utils/form'
import { toggleState } from '@/utils/toggle'
import notice from '@/utils/notice'
import ControlCode from '@/components/Page/Control/Code'

const SAMPLE_FILE_URL = import.meta.env.VITE_API_URL + '/storage/import/sample/recipient_collection.xlsx'

const store = useStore()
const attrs = useAttrs()
const emit = defineEmits(['ok'])

const formRef = ref(null)
const formState = reactive(new RecipientCollection())
const loading = ref(false)

const errors = ref({})
provide('errors', errors)

const onChangeFile = data => {
  formState.file_definition = data?.file_info
}

const onImport = () => {
  validateForm(formRef.value, () => {
    return toggleState(() => {
      return store
        .dispatch('recipientCollection/CREATE', formState)
        .then(response => {
          notice.success(response.message)
          emit('ok', RecipientCollection.make(response.data.sender))
        })
        .catch(({ message, errors: e }) => {
          notice.error(message)
          errors.value = e
        })
    }, loading)
  })
}

watch(
  () => attrs.visible,
  visible => {
    if (visible) {
      formRef.value?.clearValidate()
      errors.value = {}
      formState.fill(new RecipientCollection())
    }
  },
)
</script>
