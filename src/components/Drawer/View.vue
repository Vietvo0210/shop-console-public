<template>
  <drawer mask-closable>
    <slot />
    <loading :visible="loading" :top="65" />

    <template #extra>
      <div class="flex items-center gap-x-2">
        <btn-copy v-if="notBlank(toCopy)" :disabled="loading" @click="onClick(toCopy)" />
        <btn-edit v-if="notBlank(toEdit)" :disabled="loading" @click="onClick(toEdit)" />
      </div>
    </template>
  </drawer>
</template>

<script>
export default {
  name: 'DrawerView',
}
</script>

<script setup>
import { notBlank } from '@/utils/variable'
import Drawer from '@/components/Drawer'
import Loading from '@/components/Loading'
import BtnCopy from '@/components/Button/Copy'
import BtnEdit from '@/components/Button/Edit'
import { useRouter } from 'vue-router'
import _ from 'lodash'

const props = defineProps({
  toEdit: {
    type: [String, Function],
    default: '',
  },
  item: {
    type: Object,
    default: () => ({}),
  },
  toCopy: {
    type: [String, Function],
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

const onClick = to => {
  if (notBlank(to)) {
    _.isFunction(to) ? to() : router.push(to)
  }
}
</script>
