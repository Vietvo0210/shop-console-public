<template>
  <a-divider orientation="left" class="mb-0">
    <div class="flex items-center gap-x-1 text-indigo-500 text-sm">
      <icon-fe type="settings" />
      Tham số tin nhắn <b>{{ getDropdownProp(enumMessageSendMode, sendMode) }}</b>
    </div>
  </a-divider>

  <div class="grid grid-cols-2 gap-4">
    <div>
      <p class="font-bold mb-0">Xem trước tin nhắn</p>
      <component
        :is="ViewMessageComponent"
        :template="template"
        :class="{ 'w-[336px]': ViewMessageComponent !== ViewMessageZns }"
        v-bind="messagePreviewProps"
      />
    </div>

    <form-item v-if="sendMode === SendMode.ZNS && false && '//TODO'" label="Mã hoá RSA" :show-label="false">
      <label class="flex items-center gap-x-2">
        <b>Mã hoá RSA khi gửi tin</b>
        <a-switch :checked="info.zns_rsa" @change="v => onChangeInfo({ zns_rsa: v })" />
      </label>
    </form-item>
  </div>

  <tbl v-if="notEmpty(template.params)" :data-source="template.params" :pagination="false" sticky>
    <tbl-col title="Tham số" :width="200" fixed="left">
      <template #default="{ record }">
        <tag theme="info">{{ record }}</tag>
        <div v-if="sendMode === SendMode.ZNS" class="text-[0.8rem] mt-2">
          <p class="flex items-center gap-x-1 mb-0">
            <icon-fe type="alert-triangle" />
            <span>Kiểu dữ liệu <b>{{ _.lowerFirst(getZnsParamTypeLabel(record)) }}</b></span>
          </p>
          <small class="block text-slate-500">Tối đa <b> {{ cast.toNumber(getZnsParamMaxLength(record)) }}</b>
            ký tự</small>
          <small v-if="getZnsParamType(record) === 'DATE'" class="block text-slate-500">Ví dụ:
            <b><span v-if="getZnsParamMaxLength(record) > 10">{{ dayjs().format(TIME_FORMAT) }} </span>
              {{ format.toDate(dayjs()) }}</b>
          </small>
        </div>
      </template>
    </tbl-col>
    <tbl-col :width="300">
      <template #title>
        <span class="required">Nguồn dữ liệu</span>
      </template>
      <template #default="{ record }">
        <form-item :name="['mapping_params', index, record, 'type']" label="Loại giá trị" :show-label="false" required>
          <pulldown
            :options="enumMappingParamType"
            :value="mappingParam[record]?.type"
            @change="v => onChangeType(record, v)"
          />
        </form-item>
      </template>
    </tbl-col>
    <tbl-col :width="300">
      <template #title>
        <span class="required">Giá trị</span>
      </template>
      <template #default="{ record }">
        <form-item :name="['mapping_params', index, record, 'value']" label="Giá trị" :show-label="false" required>
          <text-area
            v-if="mappingParam[record]?.type === BroadcastMappingParamType.STATIC"
            auto-size
            :maxlength="getZnsParamMaxLength(record)"
            :value="mappingParam[record]?.value"
            @change="onChangeMappingParam({ [`${record}.value`]: $event.target.value })"
          />
          <template v-else>
            <pulldown
              :options="getValueOptions(record)"
              :value="mappingParam[record]?.value"
              @change="v => onChangeMappingParam({ [`${record}.value`]: v })"
            >
              <template #extra="{ value }">
                <small
                  v-if="mappingParam[record]?.type === BroadcastMappingParamType.RECIPIENT_INFO"
                  class="text-slate-500"
                >(Ví dụ: <b>{{ getFileDefinitionHeadCellData(value) }}</b>)</small>
              </template>
            </pulldown>
            <p
              v-if="
                mappingParam[record]?.type === BroadcastMappingParamType.RECIPIENT_INFO
                && notBlank(mappingParam[record]?.value)
              "
              class="text-[0.8rem] text-slate-500 mt-2 mb-0"
            >
              Ví dụ: <b>{{ getFileDefinitionHeadCellData(mappingParam[record]?.value) }}</b>
            </p>
          </template>
        </form-item>
      </template>
    </tbl-col>
  </tbl>
  <p v-else class="text-slate-500 mb-0">Không có tham số nào.</p>
</template>

<script>
export default {
  name: 'BroadcastMappingParams',
}
</script>

<script setup>
import IconFe from '@/components/Icon/Fe'
import { computed } from 'vue'
import { getDropdownProp } from '@/utils/dropdown'
import { useStore } from 'vuex'
import Tbl from '@/components/Table'
import TblCol from '@/components/Table/Column'
import Pulldown from '@/components/Pulldown'
import FormItem from '@/components/Form/Item'
import Tag from '@/components/Tag'
import { BroadcastMappingParamType, ZNSParamTypeEnum, SendMode } from '@/utils/enums'
import { setMany, walkRecursive } from '@/utils/collection'
import _ from 'lodash'
import { notEmpty, notBlank } from '@/utils/variable'
import cast from '@/utils/cast'
import ViewMessageZms from '@/components/Page/View/Message/ZMS'
import ViewMessageZns from '@/components/Page/View/Message/ZNS'
import ViewMessageSms from '@/components/Page/View/Message/SMS'
import randomstring from 'randomstring'
import dayjs from 'dayjs'
import { TIME_FORMAT } from '@/utils/consts'
import format from '@/utils/format'
import TextArea from '@/components/TextArea'

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  mappingParam: {
    type: Object,
    default: () => ({}),
  },
  info: {
    type: Object,
    default: () => ({}),
  },
  sendMode: {
    type: Number,
    required: true,
  },
  fileDefinition: {
    type: Object,
    required: true,
  },
  template: {
    type: Object,
    required: true,
  },
})

const store = useStore()
const emit = defineEmits(['update:mappingParam', 'update:info'])

const endUsersZaloSampleMapping = Object.freeze({
  user_id: randomstring.generate({ length: 18, charset: 'numeric' }),
  name: 'Nguyễn Văn A',
  phone: '0' + randomstring.generate({ length: 9, charset: '123456789' }),
  gender: 'Nam',
  birthday: '30/05/1990',
  email: 'nguyenvana@gmail.com',
  avatar: window.location.origin + '/no-image.png',
  province: 'Hồ Chí Minh',
  district: 'Quận Tân Bình',
  ward: 'Phường 2',
  address: '2 Hồng Hà',
})

const ViewMessageComponent = computed(() => {
  const mapping = {
    [SendMode.ZMS]: ViewMessageZms,
    [SendMode.ZNS]: ViewMessageZns,
    [SendMode.SMS]: ViewMessageSms,
  }
  return mapping[props.sendMode]
})

const enumMessageSendMode = computed(() => store.getters['dropdown/getEnum']('message.send_mode'))
const enumMappingParamType = computed(() => store.getters['dropdown/getEnum']('broadcast.mapping_param.type'))
const enumEndUserProperty = computed(() => {
  return store.getters['dropdown/getEnum']('broadcast.mapping_param.end_user_property')
})

const mappingParamSamples = computed(() => {
  const samples = {}

  _.each(props.mappingParam, (option, param) => {
    switch (option.type) {
      case BroadcastMappingParamType.RECIPIENT_INFO:
        samples[param] = getFileDefinitionHeadCellData(option.value)
        break

      case BroadcastMappingParamType.END_USERS_ZALO:
        samples[param] = endUsersZaloSampleMapping[option.value]
        break

      case BroadcastMappingParamType.STATIC:
      default:
        samples[param] = option.value
        break
    }
  })

  return samples
})

const messagePreviewProps = computed(() => {
  if (props.sendMode === SendMode.ZNS) {
    return { templateData: mappingParamSamples.value }
  }

  const mapping = {
    [SendMode.ZMS]: ['replacedMessage', props.template.message],
    [SendMode.SMS]: ['replacedText', props.template.message?.text],
  }
  const [prop, message] = mapping[props.sendMode]
  return {
    [prop]: walkRecursive(message, value => {
      value = cast.toString(value)
      _.each(mappingParamSamples.value, (v, param) => {
        if (notBlank(v)) {
          value = value.replace(`{${param}}`, v)
        }
      })
      return value
    }),
  }
})

const getZnsParamOption = param => {
  return _.find(props.template.message?.listParams, ['name', param])
}

const getZnsParamType = param => {
  return _.get(getZnsParamOption(param), 'type', 'STRING')
}

const getZnsParamTypeLabel = param => {
  return _.get(ZNSParamTypeEnum, getZnsParamType(param), ZNSParamTypeEnum.STRING)
}

const getZnsParamMaxLength = param => {
  return _.get(getZnsParamOption(param), 'maxLength', 100)
}

const getFileDefinitionHeadCellData = index => {
  return _.get(props.fileDefinition.head_row_data, '0.' + index)
}

const getValueOptions = param => {
  switch (props.mappingParam[param]?.type) {
    case BroadcastMappingParamType.END_USERS_ZALO:
      return enumEndUserProperty.value

    case BroadcastMappingParamType.RECIPIENT_INFO:
      return _.range(0, props.fileDefinition.total_column).map(i => ({
        value: i,
        label: `Cột ${i + 1}`,
      }))

    default:
      return null
  }
}

const onChangeType = (record, type) => {
  onChangeMappingParam({
    [`${record}.type`]: type,
    [`${record}.value`]: null,
  })
}

const onChangeMappingParam = values => {
  emit('update:mappingParam', setMany(props.mappingParam, values))
}

const onChangeInfo = values => {
  emit('update:info', setMany(props.info, values))
}
</script>
