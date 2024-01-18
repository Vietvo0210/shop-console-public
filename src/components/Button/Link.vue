<template>
  <a href="javascript:" @click="onClick">
    <slot />
  </a>
</template>

<script>
export default {
  name: 'BtnLink',
}
</script>

<script setup>
import { useRouter } from 'vue-router'
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
