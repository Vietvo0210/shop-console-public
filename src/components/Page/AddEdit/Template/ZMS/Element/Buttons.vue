<template>
  <div class="flex flex-col gap-y-2 ml-4">
    <div v-for="(button, btnIndex) in buttons" :key="btnIndex">
      <div class="rounded-md bg-slate-300 px-2 py-1">
        <a-popover trigger="click" v-model:visible="popovers.configButtons[btnIndex].visible">
          <template #title><b class="text-indigo-500 text-base">Cấu hình nút</b></template>
          <template #content>
            <div class="flex flex-col gap-y-2">
              <p class="flex items-center gap-x-2 mb-0">
                <b>Khi nhấn:</b>
                <component :is="getActionLabel(button, 'button')" />
                <a-tooltip title="Thay đổi">
                  <icon-fe type="edit" class="text-sky-500 cursor-pointer" @click="onSelectAction(btnIndex)" />
                </a-tooltip>
              </p>
              <hr />
              <p class="text-right mb-0">
                <btn-link text="Xóa nút" class="text-red-500 cursor-pointer" @click="onRemoveElement(btnIndex)" />
              </p>
            </div>
          </template>
          <form-item
            :name="['message', 'buttons', btnIndex, 'title']"
            :label="'Tiêu đề nút ' + (btnIndex + 1)"
            :show-label="false"
            class="relative"
            required
          >
            <a-input
              :value="button.title"
              :maxlength="100"
              :placeholder="'Tiêu đề nút ' + (btnIndex + 1)"
              class="p-0 bg-transparent border-2 border-dashed border-sky-300 text-[0.8rem] overflow-hidden text-center placeholder:text-[0.8rem] placeholder:text-slate-400"
              autocomplete="off"
              @change="onChange({ [`buttons.${btnIndex}.title`]: $event.target.value })"
            />
          </form-item>
        </a-popover>
      </div>

      <form-error :name="`message.buttons.${btnIndex}.action`" />
    </div>

    <div
      v-if="buttons.length < MAX_BUTTONS"
      class="flex items-center justify-center text-sky-500 cursor-pointer text-[0.8rem] opacity-50 hover:opacity-100 gap-x-1"
      @click="onAddButton"
    >
      <icon-fe type="plus-square" :size="14" />
      <span>Thêm nút</span>
    </div>
  </div>

  <modal-zalo-zms-select-action
    type="button"
    v-model:visible="modals.selectAction.visible"
    :options="selectedButtonOptions"
    @ok="onSelectedAction"
  />
</template>

<script>
export default {
  name: 'AddEditTemplateZmsElementButtons',
}
</script>

<script setup>
import IconFe from '@/components/Icon/Fe'
import FormItem from '@/components/Form/Item'
import _ from 'lodash'
import ModalZaloZmsSelectAction, { getActionLabel } from '@/components/Modal/Zalo/ZMS/SelectAction'
import { computed, inject, reactive, ref } from 'vue'
import FormError from '@/components/Form/Errors'
import { removeArrayIndex } from '@/utils/collection'
import { empty } from '@/utils/variable'
import { ZMSMessageButtonDefault } from '@/utils/enums'
import BtnLink from '@/components/Button/Link'

const MAX_BUTTONS = 5

const props = defineProps({
  buttons: {
    type: Array,
    default: () => [],
  },
})

const onChange = inject('onChange')

const modals = reactive({
  selectAction: {
    visible: false,
  },
})
const popovers = reactive({
  configButtons: _.range(MAX_BUTTONS).map(() => ({
    visible: false,
  })),
})
const selectedButtonIndex = ref(null)
const selectedButtonOptions = computed(() => _.get(props.buttons, selectedButtonIndex.value, {}))

const onAddButton = () => {
  onChange({ buttons: _.concat(props.buttons, _.cloneDeep(ZMSMessageButtonDefault)) })
}

const onRemoveElement = index => {
  onChange({ buttons: removeArrayIndex(props.buttons, index) })
}

const onSelectAction = index => {
  selectedButtonIndex.value = index
  popovers.configButtons[index].visible = false
  modals.selectAction.visible = true
}

const onSelectedAction = newOptions => {
  if (empty(newOptions)) {
    _.unset(props.buttons, `${selectedButtonIndex.value}.payload`)
    onChange({ buttons: props.buttons })
  } else {
    onChange({ [`buttons.${selectedButtonIndex.value}`]: newOptions })
  }
  selectedButtonIndex.value = null
  modals.selectAction.visible = false
}
</script>
