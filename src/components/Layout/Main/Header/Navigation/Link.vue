<template>
  <a class="flex items-center" :class="{ 'text-current px-4 hover:text-[#1890ff]': isSub }" @click="onClick">
    {{ route.meta?.title }}
  </a>
</template>

<script>
export default {
  name: 'MainHeaderNavLink',
}
</script>

<script setup>
import IconFe from '@/components/Icon/Fe'
import { useRouter } from 'vue-router'

const props = defineProps({
  route: {
    type: Object,
    required: true,
  },
  isSub: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

const onClick = () => {
  const path = props.route.path
  if (path !== '/#') {
    router.push(path)
  }
}
</script>
<style>
.custom-icon {
  width: 24px;
  height: 24px;
}

</style>