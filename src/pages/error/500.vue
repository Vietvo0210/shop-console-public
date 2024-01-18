<template>
  <a-result :status="500" :title="pageTitle" sub-title="Rất tiếc, đã có lỗi xảy ra.">
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
