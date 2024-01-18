<template>
  <div class="relative rounded-md bg-sky-200 ml-4">
    <span class="absolute w-0 h-0 bottom-4 -left-4 border-[1rem] border-transparent border-b-sky-200" />
    <div>
      <p class="flex items-center gap-x-1 mb-0 px-4 py-1">
        <icon-fe type="file-text" />
        {{ title }}
      </p>
      <a-tooltip title="Ấn để thay đổi">
        <bg-img
          class="pt-[56.25%] cursor-pointer border border-sky-200"
          :src="elements[0].image_url"
          @click="onSelectImage(0, 'element')"
        />
      </a-tooltip>
      <div class="pl-2">
        <form-error name="message.elements.0.image_url" />
      </div>

      <div class="relative p-4 pb-0">
        <a-popover trigger="click" v-model:visible="popovers.configElementRows[1].visible">
          <template #title><b class="text-indigo-500 text-base">Cấu hình tiêu đề</b></template>
          <template #content>
            <p class="flex items-center gap-x-2 mb-0">
              <b>Chọn canh lề:</b>
              <a-radio-group
                :options="convert2DropdownOptions(TextAlignEnum)"
                :value="elements[1].align"
                @change="onChange({ 'elements.1.align': $event.target.value })"
              />
            </p>
          </template>
          <form-item
            :name="['message', 'elements', 1, 'content']"
            label="Tiêu đề"
            :show-label="false"
            class="mb-2"
            required
          >
            <text-area
              :value="elements[1].content"
              auto-size
              :maxlength="100"
              placeholder="Tiêu đề"
              class="p-1 bg-transparent rounded-md border-2 border-dashed border-sky-300 text-[0.8rem] font-bold overflow-hidden placeholder:text-slate-400"
              :class="getElementAlignClass(elements[1])"
              @keydown.enter.prevent
              @change="onChange({ 'elements.1.content': $event.target.value })"
            />
          </form-item>
        </a-popover>

        <template v-for="(element, elementIndex) in elements.slice(2)" :key="elementIndex">
          <a-popover
            v-if="element.type === 'text'"
            trigger="click"
            v-model:visible="popovers.configElementRows[elementIndex + 2].visible"
          >
            <template #title
              ><b class="text-indigo-500 text-base">Cấu hình mô tả {{ elementIndex + 1 }}</b></template
            >
            <template #content>
              <div class="flex flex-col gap-y-2">
                <p class="flex items-center gap-x-2 mb-0">
                  <b>Chọn canh lề:</b>
                  <a-radio-group
                    :options="convert2DropdownOptions(TextAlignEnum)"
                    :value="element.align"
                    @change="onChange({ [`elements.${elementIndex + 2}.align`]: $event.target.value })"
                  />
                </p>
                <hr />
                <p class="text-right mb-0">
                  <btn-link
                    text="Xóa mô tả"
                    class="text-red-500 cursor-pointer"
                    @click="onRemoveElement(elementIndex + 2)"
                  />
                </p>
              </div>
            </template>
            <form-item
              :name="['message', 'elements', elementIndex + 2, 'content']"
              label="Mô tả"
              :show-label="false"
              class="mb-2"
              required
            >
              <text-area
                :value="element.content"
                :auto-size="{ minRows: 2 }"
                :maxlength="250"
                placeholder="Mô tả"
                class="p-1 bg-transparent rounded-md border-2 border-dashed border-sky-300 text-[0.75rem] overflow-hidden placeholder:text-slate-400"
                :class="getElementAlignClass(elements[elementIndex + 2])"
                @change="onChange({ [`elements.${elementIndex + 2}.content`]: $event.target.value })"
              />
            </form-item>
          </a-popover>

          <template v-else-if="element.type === 'table'">
            <div
              v-if="numberOfElementTexts < MAX_ELEMENT_TEXTS"
              class="flex items-center justify-center text-sky-500 cursor-pointer text-[0.8rem] opacity-50 hover:opacity-100 gap-x-1 py-2"
              @click="onAddElementText(elementIndex + 2)"
            >
              <icon-fe type="plus-square" :size="14" />
              <span>Thêm mô tả</span>
            </div>

            <div class="flex flex-col gap-y-2 mb-2">
              <div>
                <form-error :name="`message.elements.${elementIndex + 2}.content.0.key`" />
                <div class="flex gap-x-2">
                  <div class="basis-5/12">
                    <b class="text-[0.75rem]">Loại tin</b>
                  </div>
                  <div class="basis-7/12">
                    <form-item :name="['message', 'template_type']" label="Loại tin" :show-label="false">
                      <pulldown
                        :value="templateType"
                        :options="convert2DropdownOptions(ZMSMessageTransactionTemplateTypeEnum)"
                        class="message-template-type rounded-md border-2 border-dashed border-sky-300 text-[0.75rem]"
                        :allow-clear="false"
                        @change="v => onChange({ template_type: v })"
                      />
                    </form-item>
                  </div>
                </div>
              </div>

              <draggable
                :list="element.content"
                :animation="400"
                handle=".draggable-handler"
                ghost-class="bg-sky-300"
                class="flex flex-col gap-y-2"
                @change="onChange({ elements })"
              >
                <transition-group>
                  <div v-for="(row, rowIndex) in element.content" :key="rowIndex" class="flex items-center gap-x-2">
                    <a-popover trigger="click" v-model="popovers.configElementRows[rowIndex].visible">
                      <template #content>
                        <div class="flex flex-col gap-y-2">
                          <template v-if="row.key === 'Trạng thái'">
                            <p class="flex items-center gap-x-2 mb-0">
                              <b>Chọn màu:</b>
                              <a-radio-group
                                :value="row.style ?? 'green'"
                                @change="
                                  onChange({
                                    [`elements.${elementIndex + 2}.content.${rowIndex}.style`]: $event.target.value,
                                  })
                                "
                              >
                                <a-radio
                                  v-for="(label, value) in ZMSElementTableRowStatusColorEnum"
                                  :key="value"
                                  :value="value"
                                >
                                  <span
                                    class="rounded p-1"
                                    :class="{ 'text-white': value !== 'yellow' }"
                                    :style="{ backgroundColor: value }"
                                  >{{ label }}</span>
                                </a-radio>
                              </a-radio-group>
                            </p>
                            <hr />
                          </template>
                          <p v-if="numberOfElementTableRows > 1" class="text-right mb-0">
                            <btn-link
                              text="Xóa dòng"
                              class="text-red-500 cursor-pointer"
                              @click="onRemoveElementTableRow(rowIndex)"
                            />
                          </p>
                        </div>
                      </template>
                      <div class="flex gap-x-2">
                        <div class="basis-5/12 flex items-center gap-x-2">
                          <a-tooltip v-if="element.content.length > 1" title="Kéo/thả để sắp xếp">
                            <icon-fe type="menu" :size="16" class="draggable-handler cursor-move" />
                          </a-tooltip>
                          <form-item
                            :name="['message', 'elements', elementIndex + 2, 'content', rowIndex, 'key']"
                            label="Thuộc tính"
                            :show-label="false"
                            required
                          >
                            <text-area
                              :value="row.key"
                              auto-size
                              :maxlength="25"
                              placeholder="Thuộc tính"
                              class="p-1 bg-transparent rounded-md border-2 border-dashed border-sky-300 text-[0.75rem] overflow-hidden placeholder:text-slate-400"
                              @keydown.enter.prevent
                              @change="
                                onChange({
                                  [`elements.${elementIndex + 2}.content.${rowIndex}.key`]: $event.target.value,
                                })
                              "
                            />
                          </form-item>
                        </div>
                        <div class="basis-7/12">
                          <form-item
                            :name="['message', 'elements', elementIndex + 2, 'content', rowIndex, 'value']"
                            label="Giá trị"
                            :show-label="false"
                            required
                          >
                            <text-area
                              :value="row.value"
                              auto-size
                              :maxlength="100"
                              placeholder="Giá trị"
                              class="p-1 bg-transparent rounded-md border-2 border-dashed border-sky-300 text-[0.75rem] overflow-hidden placeholder:text-slate-400"
                              @keydown.enter.prevent
                              @change="
                                onChange({
                                  [`elements.${elementIndex + 2}.content.${rowIndex}.value`]: $event.target.value,
                                })
                              "
                            />
                          </form-item>
                        </div>
                      </div>
                    </a-popover>
                  </div>
                </transition-group>
              </draggable>

              <div
                v-if="numberOfElementTableRows < MAX_TABLE_ROWS"
                class="flex items-center justify-center text-sky-500 cursor-pointer text-[0.8rem] opacity-50 hover:opacity-100 gap-x-2 py-2"
                @click="onAddTableRow"
              >
                <icon-fe type="plus" :size="14" />
                <span>Thêm dòng</span>
              </div>
            </div>
          </template>
        </template>

        <div
          v-if="numberOfElementTexts < MAX_ELEMENT_TEXTS"
          class="flex items-center justify-center text-sky-500 cursor-pointer text-[0.8rem] opacity-50 hover:opacity-100 gap-x-2 py-2"
          @click="onAddElementText(elements.length)"
        >
          <icon-fe type="plus-square" :size="14" />
          <span>Thêm mô tả</span>
        </div>
      </div>
    </div>

    <div class="border-t border-slate-200">
      <draggable
        :list="buttons"
        :animation="400"
        handle=".draggable-handler"
        ghost-class="bg-sky-300"
        @change="onChange({ buttons })"
      >
        <transition-group>
          <div
            v-for="(button, buttonIndex) in buttons"
            :key="buttonIndex"
            class="group relative flex items-center gap-x-1 border-b border-slate-200 px-4"
          >
            <a-tooltip v-if="buttons.length > 1" title="Kéo/thả để sắp xếp">
              <icon-fe type="menu" :size="16" class="draggable-handler cursor-move" />
            </a-tooltip>
            <div class="flex-none py-2">
              <a-tooltip title="Ấn để thay đổi">
                <bg-img
                  class="w-12 h-12 cursor-pointer"
                  :src="button.image_icon"
                  @click="onSelectImage(buttonIndex, 'button')"
                />
              </a-tooltip>
            </div>
            <div class="flex-auto flex items-center py-2">
              <a-popover trigger="click" v-model:visible="popovers.configButtons[buttonIndex].visible">
                <template #title
                  ><b class="text-indigo-500 text-base">Cấu hình nút {{ buttonIndex + 1 }}</b></template
                >
                <template #content>
                  <div class="flex flex-col gap-y-2">
                    <p class="flex items-center gap-x-2 mb-0">
                      <b>Khi nhấn:</b>
                      <component :is="getActionLabel(button, 'button')" />
                      <a-tooltip title="Thay đổi">
                        <icon-fe type="edit" class="text-sky-500 cursor-pointer" @click="onSelectAction(buttonIndex)" />
                      </a-tooltip>
                    </p>
                    <hr />
                    <p class="text-right mb-0">
                      <btn-link
                        text="Xóa nút"
                        class="text-red-500 cursor-pointer"
                        @click="onRemoveButton(buttonIndex)"
                      />
                    </p>
                  </div>
                </template>
                <form-item
                  :name="['message', 'buttons', buttonIndex, 'title']"
                  :label="`Tiêu đề nút ${buttonIndex + 1}`"
                  :show-label="false"
                  class="w-full"
                  required
                >
                  <text-area
                    :value="button.title"
                    auto-size
                    :maxlength="100"
                    :placeholder="`Tiêu đề nút ${buttonIndex + 1}`"
                    class="p-[2px] bg-transparent rounded-md border-2 border-dashed border-sky-300 text-[0.75rem] overflow-hidden placeholder:text-slate-400"
                    @keydown.enter.prevent
                    @change="onChange({ [`buttons.${buttonIndex}.title`]: $event.target.value })"
                  />
                </form-item>
              </a-popover>
            </div>
            <icon-fe type="chevron-right" :size="24" class="text-slate-500" />
          </div>
        </transition-group>
      </draggable>

      <div
        v-if="buttons.length < MAX_BUTTONS"
        class="flex items-center justify-center text-sky-500 cursor-pointer text-[0.8rem] opacity-50 hover:opacity-100 gap-x-1 py-2"
        @click="onAddButton"
      >
        <icon-fe type="plus-square" :size="14" />
        <span>Thêm nút</span>
      </div>
    </div>
  </div>

  <modal-zalo-zms-select-image
    v-model:visible="modals.selectImage.visible"
    :image-url="selectedImageUrl"
    :field="selectedButton ? 'button' : 'element'"
    :required="!selectedButton"
    @ok="onSelectedImage"
  />
  <modal-zalo-zms-select-action
    type="button"
    v-model:visible="modals.selectAction.visible"
    :options="selectedButtonOptions"
    @ok="onSelectedAction"
  />
</template>

<style lang="scss">
.ant-select.message-template-type {
  .ant-select-selector {
    background-color: transparent !important;
    border: none !important;
  }

  &.ant-select-open .ant-select-selection-item {
    color: #00000085 !important;
  }
}
</style>

<script>
export default {
  name: 'AddEditTemplateZmsElementListV3',
}
</script>

<script setup>
import FormItem from '@/components/Form/Item'
import IconFe from '@/components/Icon/Fe'
import { computed, inject, reactive, ref } from 'vue'
import _ from 'lodash'
import FormError from '@/components/Form/Errors'
import { insertArray, removeArrayIndex } from '@/utils/collection'
import BgImg from '@/components/BackgroundImage'
import {
  ZMSElementTableRowStatusColorEnum,
  TextAlignEnum,
  ZMSMessageButtonDefault,
  ZMSMessageTransactionTemplateTypeEnum,
} from '@/utils/enums'
import { convert2DropdownOptions } from '@/utils/dropdown'
import ModalZaloZmsSelectAction, { getActionLabel } from '@/components/Modal/Zalo/ZMS/SelectAction'
import ModalZaloZmsSelectImage from '@/components/Modal/Zalo/ZMS/SelectImage'
import { empty, notBlank } from '@/utils/variable'
import Pulldown from '@/components/Pulldown'
import { VueDraggableNext as Draggable } from 'vue-draggable-next'
import TextArea from '@/components/TextArea'
import BtnLink from '@/components/Button/Link'

const MAX_ELEMENT_TEXTS = 2
const MAX_TABLE_ROWS = 5
const MAX_BUTTONS = 4

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  templateType: {
    type: String,
    default: 'transaction_billing',
  },
  elements: {
    type: Array,
    required: true,
  },
  buttons: {
    type: Array,
    required: true,
  },
})

const onChange = inject('onChange')

const modals = reactive({
  selectImage: {
    visible: false,
  },
  selectAction: {
    visible: false,
  },
})
const popovers = reactive({
  configElementRows: _.range(MAX_TABLE_ROWS).map(() => ({
    visible: false,
  })),
  configButtons: _.range(MAX_BUTTONS).map(() => ({
    visible: false,
  })),
})
const selectedElementIndex = ref(null)
const selectedButtonIndex = ref(null)
const selectedButton = computed(() => notBlank(selectedButtonIndex.value))
const selectedImageUrl = computed(() => _.get(props.elements, selectedElementIndex.value + '.image_url', ''))
const selectedButtonOptions = computed(() => _.get(props.buttons, selectedButtonIndex.value, {}))

const numberOfElementTexts = computed(() => _.filter(props.elements, ['type', 'text']).length)
const elementTableIndex = computed(() => _.findIndex(props.elements, ['type', 'table']))
const numberOfElementTableRows = computed(() => props.elements[elementTableIndex.value].content.length)

const getElementAlignClass = element => {
  const mapping = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  return mapping[element.align ?? 'left']
}

const onAddElementText = index => {
  insertArray(props.elements, index, {
    type: 'text',
    content: null,
    align: 'left',
  })
  onChange({ elements: props.elements })
}

const onRemoveElement = index => {
  onChange({ elements: removeArrayIndex(props.elements, index) })
}

const onAddTableRow = () => {
  const elements = props.elements
  elements[elementTableIndex.value].content.push({
    key: '',
    value: '',
  })
  onChange({ elements })
}

const onRemoveElementTableRow = index => {
  removeArrayIndex(props.elements[elementTableIndex.value].content, index)
  onChange({ elements: props.elements })
}

const onSelectImage = (index, type = 'element') => {
  modals.selectImage.visible = true
  if (type === 'button') {
    selectedButtonIndex.value = index
    selectedElementIndex.value = null
    return
  }
  selectedElementIndex.value = index
  selectedButtonIndex.value = null
}

const onSelectedImage = newImageUrl => {
  modals.selectImage.visible = false
  if (selectedButton.value) {
    onChange({ [`buttons.${selectedButtonIndex.value}.image_icon`]: newImageUrl })
    selectedButtonIndex.value = null
    return
  }
  onChange({ [`elements.${selectedElementIndex.value}.image_url`]: newImageUrl })
  selectedElementIndex.value = null
}

const onAddButton = () => {
  if (props.buttons.length < MAX_BUTTONS) {
    onChange({ buttons: _.concat(props.buttons, _.cloneDeep(ZMSMessageButtonDefault)) })
  }
}

const onRemoveButton = index => {
  onChange({ buttons: removeArrayIndex(props.buttons, index) })
}

const onSelectAction = index => {
  selectedButtonIndex.value = index
  popovers.configButtons[index].visible = false
  modals.selectAction.visible = true
}

const onSelectedAction = newOptions => {
  if (empty(newOptions)) {
    _.unset(props.buttons, `${selectedButtonIndex.value}.value`)
    onChange({ buttons: props.buttons })
  } else {
    onChange({ [`buttons.${selectedButtonIndex.value}`]: newOptions })
  }
  selectedButtonIndex.value = null
  modals.selectAction.visible = false
}
</script>
