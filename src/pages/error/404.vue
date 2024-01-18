<template>
  <a-result :status="404" :title="pageTitle" sub-title="Rất tiếc, trang bạn truy cập không tồn tại.">
    <template #extra>
      <btn-link to="/" type="primary" class="mx-auto">Về trang chủ</btn-link>
    </template>
  </a-result>
</template>

<script setup>
import BtnLink from '@/components/Button/Link'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => route.meta.title)
</script>
