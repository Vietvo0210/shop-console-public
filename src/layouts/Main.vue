<template>
  <div class="flex flex-col min-h-screen gap-y-4">
    <main-header class="flex-none" />
    <main-content class="flex-auto" />
    <main-footer class="flex-none" />
  </div>
</template>

<script setup>
import MainHeader from '@/components/Layout/Main/Header'
import MainContent from '@/components/Layout/Main/Content'
import MainFooter from '@/components/Layout/Main/Footer'
</script>
