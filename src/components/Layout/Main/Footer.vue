<template>
  <footer class="sticky top-full bg-slate-100 drop-shadow text-slate-500 border-t text-center py-2">
    <small>&copy;{{ dayjs().format(YEAR_FORMAT) }} </small>
  </footer>
</template>

<script>
export default {
  name: 'MainFooter',
}
</script>

<script setup>
import dayjs from 'dayjs'
import { YEAR_FORMAT } from '@/utils/consts'
</script>
