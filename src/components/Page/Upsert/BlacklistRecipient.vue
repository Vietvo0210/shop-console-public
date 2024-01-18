<template>
  <drawer-save :title="BlacklistRecipient.name" mode="save" :loading="loading" @submit="onSave">
    <a-form ref="formRef" :model="formState" layout="vertical" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <form-item label="Kiểu thêm mới">
          <a-radio-group
            :options="convert2DropdownOptions(BlacklistRecipientUpsertModeEnum)"
            v-model:value="formState.upsert_mode"
          />
        </form-item>

        <div>
          <b>Thời gian chặn</b>
          <div class="flex items-center gap-x-2">
            <form-item name="blocked_from" class="flex-auto">
              <date-picker v-model:value="formState.blocked_from" show-time />
            </form-item>
            <span>→</span>
            <form-item name="blocked_to" class="flex-auto">
              <date-picker v-model:value="formState.blocked_to" show-time is-end-time />
            </form-item>
          </div>
        </div>
      </div>

      <form-item v-if="formState.upsert_mode === 'upsert'" name="phones" label="Danh sách SĐT bị chặn" required>
        <text-area
          :auto-size="{ minRows: 5 }"
          placeholder="09xxx&#10;08xxx&#10;07xxx"
          :value="formState.phones.join('\n')"
          @change="onChangePhones($event.target.value)"
          @blur="onBlurPhones"
        />
        <small class="text-slate-500">Mỗi SĐT nằm trên một dòng</small>
      </form-item>

      <form-item v-else-if="formState.upsert_mode === 'import'" name="filepath" label="File tập SĐT bị chặn" required>
        <upload
          dir="import/blacklist_recipient"
          v-model:value="formState.filepath"
          v-model:origin-name="formState.filename"
          :sample-file="{ name: 'file-mau-import-tap-sdt-bi-chan.xlsx', url: SAMPLE_FILE_URL }"
          accept=".txt,.csv,.tsv,.xls,.xlsx"
        />
        <small class="text-slate-500">Có thể sử dụng định dạng: excel, txt, csv, tsv</small>
      </form-item>
    </a-form>
  </drawer-save>
</template>

<script>
export default {
  name: 'UpsertBlacklistRecipient',
}
</script>

<script setup>
import DrawerSave from '@/components/Drawer/Save'
import BlacklistRecipient from '@/models/BlacklistRecipient'
import { provide, reactive, ref, useAttrs, watch } from 'vue'
import { toggleState } from '@/utils/toggle'
import { useStore } from 'vuex'
import FormItem from '@/components/Form/Item'
import Upload from '@/components/Upload'
import { validateForm } from '@/utils/form'
import notice from '@/utils/notice'
import { notBlank } from '@/utils/variable'
import DatePicker from '@/components/DatePicker'
import _ from 'lodash'
import { convert2DropdownOptions } from '@/utils/dropdown'
import { BlacklistRecipientUpsertModeEnum } from '@/utils/enums'
import format from '@/utils/format'
import TextArea from '@/components/TextArea'

const SAMPLE_FILE_URL = import.meta.env.VITE_API_URL + '/storage/import/sample/blacklist_recipient.xlsx'

const store = useStore()
const attrs = useAttrs()
const emit = defineEmits(['ok'])

const defaultState = Object.freeze({
  upsert_mode: 'upsert',
  phones: [],
  filepath: null,
  blocked_from: null,
  blocked_to: null,
})

const formRef = ref(null)
const formState = reactive(_.cloneDeep(defaultState))
const loading = ref(false)

const errors = ref({})
provide('errors', errors)

const onChangePhones = text => {
  formState.phones = text.replace(/[^\d\s]/g, '').split('\n')
}

const onBlurPhones = () => {
  formState.phones = formState.phones.filter(notBlank)
}

const onSave = () => {
  validateForm(formRef.value, () => {
    return toggleState(() => {
      return store
        .dispatch('blacklistRecipient/UPSERT', formState)
        .then(response => {
          const { created, updated } = response.data
          const description = `· Thêm mới ${format.toNumber(created)} dữ liệu\n`
            + `· Cập nhật ${format.toNumber(updated)} dữ liệu`
          notice.success(response.message, { description })
          emit('ok')
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

      Object.assign(formState, _.cloneDeep(defaultState))
    }
  },
)
</script>
