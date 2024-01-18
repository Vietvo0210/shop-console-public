<template>
  <div class="relative rounded-md bg-sky-200 ml-4">
    <span class="absolute w-0 h-0 bottom-4 -left-4 border-[1rem] border-transparent border-b-sky-200" />
    <div class="relative z[1]">
      <bg-img :src="firstElement.image_url" class="pt-[56.25%] rounded-t-md border border-sky-200" />
      <div class="relative text-[0.8rem] p-4">
        <p class="font-bold mb-2">{{ firstElement.title }}</p>
        <p class="mb-0">{{ firstElement.subtitle }}</p>
        <a-tooltip>
          <template #title>
            <component :is="getActionLabel(firstElement, 'element')" />
          </template>
          <icon-fe
            type="settings"
            class="absolute top-[0.125rem] right-[0.125rem] text-red-500 cursor-pointer opacity-50 hover:opacity-100"
          />
        </a-tooltip>
      </div>
    </div>
    <div v-if="notEmpty(elements)" class="relative z[1] border-t border-slate-200 px-4">
      <div v-for="(element, elIndex) in _.omit(elements, 0)" :key="elIndex">
        <div class="relative flex gap-x-1">
          <div class="flex-none py-2">
            <bg-img :src="element.image_url" class="w-12 h-12" />
          </div>
          <div class="flex-auto flex items-center border-b border-slate-200 py-2">
            <p class="text-[0.75rem] mb-0">{{ element.title }}</p>
          </div>
          <a-tooltip>
            <template #title>
              <component :is="getActionLabel(element, 'element')" />
            </template>
            <icon-fe
              type="settings"
              class="absolute top-[0.125rem] left-full text-red-500 cursor-pointer opacity-50 hover:opacity-100"
            />
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewMessageZmsElementList',
}
</script>

<script setup>
import { computed } from 'vue'
import { notEmpty } from '@/utils/variable'
import { getActionLabel } from '@/components/Modal/Zalo/ZMS/SelectAction'
import _ from 'lodash'
import IconFe from '@/components/Icon/Fe'
import BgImg from '@/components/BackgroundImage'

const props = defineProps({
  elements: {
    type: Array,
    required: true,
  },
})

const firstElement = computed(() => props.elements[0] ?? [])
</script>
