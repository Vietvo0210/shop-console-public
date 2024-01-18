<template>
  <a-dropdown :trigger="['click']">
    <icon-fe type="bell" :size="18" class="cursor-pointer" />
    <template #overlay>
      <a-menu class="min-w-[12rem]">
        <a-menu-item class="px-4 py-2"> Không có thông báo mới. </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
export default {
  name: 'MainHeaderUserNotification',
}
</script>

<script setup>
import IconFe from '@/components/Icon/Fe'
</script>
