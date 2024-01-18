<template>
  <div class="flex items-center gap-1 flex-wrap">
    <template v-for="(item, index) in data" :key="index">
      <icon-fe v-if="index > 0" type="arrow-right" />
      <a-tooltip :title="item?.name">
        <tag :color="ColorRange[index]" :class="getItemClass(index)">{{ renderText(item) }}</tag>
      </a-tooltip>
    </template>
  </div>
</template>

<script>
export default {
  name: 'DataSendProps',
}
</script>

<script setup>
import { computed } from 'vue'
import { ColorRange } from '@/utils/enums'
import { getDropdownProp } from '@/utils/dropdown'
import IconFe from '@/components/Icon/Fe'
import Tag from '@/components/Tag'
import { useStore } from 'vuex'

const props = defineProps({
  isSendMode: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    required: true,
  },
  sentTimes: {
    type: Number,
    default: 0,
  },
  isSuccess: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()

const enumMessageSendMode = computed(() => {
  return props.isSendMode ? store.getters['dropdown/getEnum']('message.send_mode') : []
})

const renderText = item => {
  return props.isSendMode ? getDropdownProp(enumMessageSendMode.value, item) : item.code
}

const getItemClass = index => {
  if (index + 1 > props.sentTimes) {
    return null
  }
  if (props.isSuccess && index + 1 === props.sentTimes) {
    return 'font-bold'
  }
  return 'line-through'
}
</script>
