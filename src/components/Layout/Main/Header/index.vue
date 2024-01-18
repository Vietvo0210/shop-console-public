<template>
  <header class="flex h-12 bg-slate-100 drop-shadow">
<!--    <main-header-logo class="flex-none" />-->
    <main-header-nav class="flex-auto" />
<!--    <main-header-zalo class="flex-none" />-->
<!--    <main-header-user class="flex-none" />-->
  </header>
</template>

<script>
export default {
  name: 'MainHeader',
}
</script>

<script setup>
import MainHeaderLogo from '@/components/Layout/Main/Header/Logo'
import MainHeaderUser from '@/components/Layout/Main/Header/User'
import MainHeaderNav from '@/components/Layout/Main/Header/Navigation'
import MainHeaderZalo from '@/components/Layout/Main/Header/Zalo'
</script>
