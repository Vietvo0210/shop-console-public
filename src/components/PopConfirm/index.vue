<template>
  <a-popconfirm :icon="h(QuestionCircleOutlined)" ok-text="OK">
    <template #icon>
      <icon-fe type="help-circle" />
    </template>
    <template v-for="slot in _.keys($slots)" #[slot]="options">
      <slot :name="slot" v-bind="options ?? {}" />
    </template>
  </a-popconfirm>
</template>

<script>
export default {
  name: 'PopConfirm',
}
</script>

<script setup>
import { h } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import _ from 'lodash'
import IconFe from '@/components/Icon/Fe'
</script>
