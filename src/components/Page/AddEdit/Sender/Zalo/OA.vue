<template>
  <div class="grid grid-cols-2 gap-4">
    <form-item :name="['info', 'app', 'id']" label="App ID" required>
      <a-input :value="app.id" @change="onChange({ 'app.id': $event.target.value })" />
    </form-item>

    <form-item :name="['info', 'app', 'secret_key']" label="App Secret Key" required>
      <a-input :value="app.secret_key" @change="onChange({ 'app.secret_key': $event.target.value })" />
    </form-item>

    <form-item :name="['info', 'oa', 'id']" label="OA ID" required>
      <a-input :auto-size="{ minRows: 5 }" :value="oa.id" @change="onChange({ 'oa.id': $event.target.value })" />
    </form-item>

    <form-item :name="['info', 'oa', 'secret_key']" label="OA Secret Key">
      <a-input
        :auto-size="{ minRows: 5 }"
        :value="oa.secret_key"
        @change="onChange({ 'oa.secret_key': $event.target.value })"
      />
      <p class="text-slate-500 mb-0">
        <small>Dùng chứng thực yêu cầu Webhook từ Zalo</small>
      </p>
    </form-item>
  </div>

  <form-item :name="['info', 'oa', 'access_token']" label="OA Access Token" required>
    <text-area
      :auto-size="{ minRows: 7 }"
      :value="oa.access_token"
      @change="onChange({ 'oa.access_token': $event.target.value })"
    />
    <p v-if="notBlank(oa.access_token_exp)" class="flex items-center gap-x-1 text-slate-500 mb-0 mt-1">
      <icon-fe type="clock" :size="12" />
      <small>Có hiệu lực đến: <b>{{ format.toDatetime(oa.access_token_exp) }}</b></small>
    </p>
  </form-item>

  <form-item :name="['info', 'oa', 'refresh_token']" label="OA Refresh Token">
    <text-area
      :auto-size="{ minRows: 5 }"
      :value="oa.refresh_token"
      @change="onChange({ 'oa.refresh_token': $event.target.value })"
    />
    <p class="text-slate-500 mb-0">
      <small>Dùng để làm mới OA Access Token hàng ngày</small>
    </p>
  </form-item>
</template>

<script>
export default {
  name: 'AddEditSenderZaloOa',
}
</script>

<script setup>
import FormItem from '@/components/Form/Item'
import { computed } from 'vue'
import { notBlank } from '@/utils/variable'
import IconFe from '@/components/Icon/Fe'
import format from '@/utils/format'
import { setMany } from '@/utils/collection'
import TextArea from '@/components/TextArea'

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:info'])

const app = computed(() => props.info.app ?? {})
const oa = computed(() => props.info.oa ?? {})

const onChange = values => {
  emit('update:info', setMany(props.info, values))
}
</script>
