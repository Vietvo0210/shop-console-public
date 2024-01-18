<template>
  <div class="bg-slate-100 min-h-screen pt-12">
    <img src="" alt="" class="h-24 mx-auto" />
    <div class="w-96 bg-white max-w-full mx-auto rounded-md drop-shadow-md p-6 mt-6">
      <h1 class="text-center font-bold text-2xl uppercase mb-4">{{ pageTitle }}</h1>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => route.meta.title)
</script>
