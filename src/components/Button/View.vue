<template>
  <btn theme="info" icon="info" text="Xem chi tiết" @click="onClick" />
</template>

<script>
export default {
  name: 'BtnView',
}
</script>

<script setup>
import { useRouter } from 'vue-router'
import Btn from '@/components/Button'
import { notBlank } from '@/utils/variable'
import _ from 'lodash'

const props = defineProps({
  to: {
    type: String,
    default: '',
  },
})

const router = useRouter()

const onClick = () => {
  if (notBlank(props.to)) {
    _.isFunction(props.to) ? to() : router.push(props.to)
  }
}
</script>
