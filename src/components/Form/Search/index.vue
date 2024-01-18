<template>
  <a-form
    layout="vertical"
    class="form-search flex flex-col md:flex-row gap-2 p-4 bg-slate-100 rounded-md border-b-2 border-indigo-500"
    @finish="onSearch()"
  >
    <a-collapse collapsible="disabled" class="flex-auto bg-transparent border-0" :active-key="activeKey">
      <a-collapse-panel :show-arrow="false" key="1" class="border-0">
        <template #header>
          <div class="flex items-center w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <slot />
          </div>
        </template>

        <div v-if="$slots.detail" class="flex w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <slot name="detail" />
        </div>
      </a-collapse-panel>
    </a-collapse>

    <div class="flex-none flex items-end justify-end gap-x-2">
      <btn
        v-if="$slots.detail"
        theme="info"
        :icon="`chevron-${activeKey ? 'up' : 'down'}`"
        :tooltip="activeKey ? 'Thu gọn' : 'Tìm kiếm nâng cao'"
        :class="{ 'bg-sky-600 border-sky-700': activeKey }"
        only-icon
        @click="activeKey = cast.toNumber(!activeKey)"
      />
      <btn-search type="submit" />
      <btn-cancel @click="router.replace(route.path)" />
    </div>
  </a-form>
</template>

<script>
export default {
  name: 'FormSearch',
}
</script>

<script setup>
import { isVNode, onMounted, reactive, ref, useAttrs, useSlots } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import qs from 'qs'
import _ from 'lodash'
import Btn from '@/components/Button'
import { notBlank, notEmpty } from '@/utils/variable'
import { mergeObjects } from '@/utils/collection'
import { PAGE_SIZE } from '@/utils/consts'
import cast from '@/utils/cast'
import BtnSearch from '@/components/Button/Search'
import BtnCancel from '@/components/Button/Cancel'

const route = useRoute()
const router = useRouter()
const slots = useSlots()
const attrs = useAttrs()

const activeKey = ref(0)

const defaultPagination = (queries = {}) => ({
  page: queries.page ?? 1,
  order_col: queries.order_col ?? 'id',
  order_dir: queries.order_dir ?? 'desc',
})

const queries = qs.parse(route.query)
const paginationState = reactive(defaultPagination(queries))

const onSearch = (resetPagination = true) => {
  if (resetPagination) {
    Object.assign(paginationState, defaultPagination())
  }
  const formState = mergeObjects(attrs.model, paginationState)
  const queryString = qs.stringify(formState, { encode: false })
  return router.replace(route.path + '?' + queryString)
}

const paginate = (pagination, filters, sorter) => {
  Object.assign(paginationState, {
    page: pagination.current ?? 1,
    limit: pagination.pageSize ?? PAGE_SIZE,
  })

  if (sorter && sorter.order && sorter.field) {
    Object.assign(paginationState, {
      order_col: sorter.field,
      order_dir: sorter.order === 'ascend' ? 'asc' : 'desc',
    })
  } else {
    _.unset(paginationState, 'order_col')
    _.unset(paginationState, 'order_dir')
  }

  return onSearch(false)
}

const someDetailFilters = (target = null) => {
  if (!slots.detail) {
    return false
  }
  if (!target) {
    target = slots.detail()
  }
  if (_.isFunction(target)) {
    target = target()
  }
  if (_.isArray(target)) {
    return target.some(someDetailFilters)
  }
  if (!isVNode(target)) {
    return false
  }
  if (notEmpty(cast.toArray(_.get(target.props, 'value')))) {
    return true
  }
  if (
    ['DatePickerRange', 'FilterDateRange'].includes(target.type.name)
    && ['from', 'to'].some(p => notBlank(_.get(target.props, p)))
  ) {
    return true
  }
  if (_.isObject(target.children)) {
    return _.some(target.children, someDetailFilters)
  }
  return false
}

defineExpose({
  paginate,
})

onMounted(() => {
  if (someDetailFilters()) {
    activeKey.value = 1
  }
})
</script>
