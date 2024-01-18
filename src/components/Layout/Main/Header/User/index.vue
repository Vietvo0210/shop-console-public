<template>
  <div class="user inline-flex items-center gap-2 px-4 py-2">
    <main-header-user-notification />
    <img src="" alt="User" :width="32" :height="32" class="rounded-full" />
    <main-header-user-info />
  </div>
</template>

<script>
export default {
  name: 'MainHeaderUser',
}
</script>

<script setup>
import MainHeaderUserNotification from '@/components/Layout/Main/Header/User/Notification'
import MainHeaderUserInfo from '@/components/Layout/Main/Header/User/Info'
</script>
