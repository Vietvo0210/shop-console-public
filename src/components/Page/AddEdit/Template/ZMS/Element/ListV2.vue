<template>
  <div class="relative rounded-md bg-sky-200 ml-4">
    <span class="absolute w-0 h-0 bottom-4 -left-4 border-[1rem] border-transparent border-b-sky-200" />
    <div>
      <a-tooltip title="Ấn để thay đổi">
        <bg-img
          class="pt-[56.25%] cursor-pointer rounded-t-md border border-sky-200"
          :src="firstElement.image_url"
          @click="onSelectImage(0)"
        />
      </a-tooltip>
      <div class="pl-2">
        <form-error name="message.elements.0.image_url" />
      </div>

      <a-popover trigger="click" v-model:visible="popovers.configElements[0].visible">
        <template #title><b class="text-indigo-500 text-base">Cấu hình phần tử chính</b></template>
        <template #content>
          <div class="flex flex-col gap-y-2">
            <p class="flex items-center gap-x-1 mb-0">
              <b>Khi nhấn:</b>
              <component :is="getActionLabel(firstElement, 'element')" />
              <a-tooltip title="Thay đổi">
                <icon-fe type="edit" class="text-sky-500 cursor-pointer" @click="onSelectAction(0)" />
              </a-tooltip>
            </p>
          </div>
        </template>
        <div class="relative p-4">
          <form-item
            :name="['message', 'elements', 0, 'title']"
            label="Tiêu đề"
            :show-label="false"
            class="mb-2"
            required
          >
            <text-area
              :value="firstElement.title"
              auto-size
              :maxlength="100"
              placeholder="Tiêu đề"
              class="p-1 bg-transparent rounded-md border-2 border-dashed border-sky-300 text-[0.8rem] font-bold overflow-hidden placeholder:text-slate-400"
              @keydown.enter.prevent
              @change="onChange({ 'elements.0.title': $event.target.value })"
            />
          </form-item>

          <form-item :name="['message', 'elements', 0, 'subtitle']" label="Mô tả" :show-label="false" required>
            <text-area
              :value="firstElement.subtitle"
              :auto-size="{ minRows: 2 }"
              :maxlength="500"
              placeholder="Mô tả"
              class="p-1 bg-transparent rounded-md border-2 border-dashed border-sky-300 text-[0.8rem] overflow-hidden placeholder:text-slate-400"
              @change="onChange({ 'elements.0.subtitle': $event.target.value })"
            />
          </form-item>
        </div>
      </a-popover>
    </div>

    <div v-if="maxElements > 1" class="border-t border-slate-200">
      <div v-for="(element, elIndex) in _.omit(elements, 0)" :key="elIndex">
        <div class="relative flex gap-x-1 border-b border-slate-200 px-4">
          <div class="flex-none py-2">
            <a-tooltip title="Ấn để thay đổi">
              <bg-img class="w-12 h-12 cursor-pointer" :src="element.image_url" @click="onSelectImage(elIndex)" />
            </a-tooltip>
          </div>
          <div class="flex-auto flex items-center py-2">
            <a-popover trigger="click" v-model:visible="popovers.configElements[elIndex].visible">
              <template #title
                ><b class="text-indigo-500 text-base">Cấu hình phần tử {{ elIndex }}</b></template
              >
              <template #content>
                <div class="flex flex-col gap-y-2">
                  <p class="flex items-center gap-x-2 mb-0">
                    <b>Khi nhấn:</b>
                    <component :is="getActionLabel(element, 'element')" />
                    <a-tooltip title="Thay đổi">
                      <icon-fe type="edit" class="text-sky-500 cursor-pointer" @click="onSelectAction(elIndex)" />
                    </a-tooltip>
                  </p>
                  <hr />
                  <p class="text-right mb-0">
                    <btn-link
                      text="Xóa phần tử"
                      class="text-red-500 cursor-pointer"
                      @click="onRemoveElement(elIndex)"
                    />
                  </p>
                </div>
              </template>
              <form-item
                :name="['message', 'elements', elIndex, 'title']"
                :label="'Tiêu đề phần tử ' + elIndex"
                :show-label="false"
                class="w-full"
                required
              >
                <text-area
                  :value="element.title"
                  auto-size
                  :maxlength="100"
                  :placeholder="'Tiêu đề phần tử ' + elIndex"
                  class="p-[2px] bg-transparent rounded-md border-2 border-dashed border-sky-300 text-[0.75rem] overflow-hidden placeholder:text-slate-400"
                  @keydown.enter.prevent
                  @change="onChange({ [`elements.${elIndex}.title`]: $event.target.value })"
                />
              </form-item>
            </a-popover>
          </div>
        </div>
        <form-error :name="`message.elements.${elIndex}.image_url`" />
      </div>

      <div
        v-if="elements.length < maxElements"
        class="flex items-center justify-center text-sky-500 cursor-pointer text-[0.8rem] opacity-50 hover:opacity-100 gap-x-1 py-2"
        @click="onAddElement"
      >
        <icon-fe type="plus-square" :size="14" />
        <span>Thêm phần tử</span>
      </div>
    </div>
  </div>

  <modal-zalo-zms-select-image
    v-model:visible="modals.selectImage.visible"
    :image-url="selectedImageUrl"
    @ok="onSelectedImage"
  />
  <modal-zalo-zms-select-action
    type="element"
    v-model:visible="modals.selectAction.visible"
    :options="selectedActionOptions"
    @ok="onSelectedAction"
  />
</template>

<script>
export default {
  name: 'AddEditTemplateZmsElementList',
}
</script>

<script setup>
import FormItem from '@/components/Form/Item'
import IconFe from '@/components/Icon/Fe'
import { computed, inject, reactive, ref } from 'vue'
import _ from 'lodash'
import ModalZaloZmsSelectAction, { getActionLabel } from '@/components/Modal/Zalo/ZMS/SelectAction'
import ModalZaloZmsSelectImage from '@/components/Modal/Zalo/ZMS/SelectImage'
import FormError from '@/components/Form/Errors'
import { removeArrayIndex } from '@/utils/collection'
import BgImg from '@/components/BackgroundImage'
import { empty } from '@/utils/variable'
import { ZMSMessageElementsDefaults, ZMSMessageType } from '@/utils/enums'
import TextArea from '@/components/TextArea'
import BtnLink from '@/components/Button/Link'

const props = defineProps({
  elements: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    default: ZMSMessageType.LIST,
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
  configElements: _.range(5).map(() => ({
    visible: false,
  })),
})
const firstElement = computed(() => props.elements[0] ?? {})
const maxElements = computed(() => {
  if (props.type === ZMSMessageType.LIST) {
    return 5
  }
  if (props.type === ZMSMessageType.REQUEST_USER_INFO) {
    return 1
  }
  return 0
})

const selectedElementIndex = ref(null)
const selectedImageUrl = computed(() => _.get(props.elements, selectedElementIndex.value + '.image_url', ''))
const selectedActionAttr = computed(() => selectedElementIndex.value + '.default_action')
const selectedActionOptions = computed(() => _.get(props.elements, selectedActionAttr.value, {}))

const onAddElement = () => {
  if (props.elements.length < maxElements.value) {
    onChange({ elements: _.concat(props.elements, _.cloneDeep(ZMSMessageElementsDefaults.ListV2[0])) })
  }
}

const onRemoveElement = index => {
  onChange({ elements: removeArrayIndex(props.elements, index) })
}

const onSelectImage = index => {
  selectedElementIndex.value = index
  modals.selectImage.visible = true
}

const onSelectedImage = newImageUrl => {
  onChange({ [`elements.${selectedElementIndex.value}.image_url`]: newImageUrl })
  selectedElementIndex.value = null
  modals.selectImage.visible = false
}

const onSelectAction = index => {
  selectedElementIndex.value = index
  popovers.configElements[index].visible = false
  modals.selectAction.visible = true
}

const onSelectedAction = newOptions => {
  if (empty(newOptions)) {
    _.unset(props.elements, `${selectedElementIndex.value}.default_action`)
    onChange({ elements: props.elements })
  } else {
    onChange({ [`elements.${selectedActionAttr.value}`]: newOptions })
  }
  selectedElementIndex.value = null
  modals.selectAction.visible = false
}
</script>
