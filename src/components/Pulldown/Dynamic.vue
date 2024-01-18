<template>
  <pulldown
    :options="state.options"
    :disabled="state.disabled"
    :filter-option="isEnum ? filterDropdownOption : false"
    @change="onChange"
    @search="onSearch"
    @blur="state.options = optionsWithoutKeyword"
  >
    <template v-if="state.searching" #notFoundContent>
      <a-spin size="small" />
    </template>

    <template v-for="slot in _.pull(_.keys($slots), 'notFoundContent')" #[slot]="options">
      <slot :name="slot" v-bind="options ?? {}" />
    </template>
  </pulldown>
</template>

<script>
export default {
  name: 'PulldownDynamic',
}
</script>

<script setup>
import _ from 'lodash'
import { computed, reactive, ref, useAttrs, watch } from 'vue'
import { useStore } from 'vuex'
import { blank, notEmpty } from '@/utils/variable'
import notice from '@/utils/notice'
import { toggleState } from '@/utils/toggle'
import { filterDropdownOption } from '@/utils/dropdown'
import Pulldown from '@/components/Pulldown'

const props = defineProps({
  object: {
    type: String,
    required: true,
  },
  conditions: {
    type: Object,
    default: () => ({}),
  },
  belongsWithConditions: {
    type: Boolean,
    default: true,
  },
})

const store = useStore()
const attrs = useAttrs()
const emit = defineEmits(['update:value', 'change'])

const state = reactive({
  keyword: '',
  options: [],
  disabled: false,
  searching: false,
  conditions: computed(() => props.conditions),
  belongsWithConditions: computed(() => props.belongsWithConditions),
})

const optionsWithoutKeyword = ref([])
watch(
  () => state.options,
  options => {
    if (blank(state.keyword)) {
      optionsWithoutKeyword.value = options
    }
  },
)

const isEnum = computed(() => notEmpty(store.getters['dropdown/getEnum'](props.object)))

const fetchOptions = (keyword = '') => {
  if (isEnum.value) {
    return true
  }

  state.options = []
  if (state.belongsWithConditions && notEmpty(state.conditions) && _.every(state.conditions, blank)) {
    return true
  }

  const queries = {
    objects: props.object,
    keyword,
    ...state.conditions,
  }
  return store
    .dispatch('dropdown/LIST', queries)
    .then(options => (state.options = options[props.object]))
    .catch(notice.error)
}

const onSearch = _.debounce(keyword => {
  state.keyword = keyword
  return toggleState(() => fetchOptions(keyword), state, 'searching')
}, 400)

const onChange = value => {
  emit('update:value', value)
  emit('change', value)
}

defineExpose({
  getValue: () => attrs.value,
  setValue: onChange,

  getState: (path = '') => (blank(path) ? state : _.get(state, path)),
  setState: newState => Object.assign(state, newState),

  getObject: () => props.object,
})
</script>
