<template>
  <localization>
    <router-view />
  </localization>
</template>

<script setup>
import Localization from '@/Localization'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import localStore from 'store'
import dayjs from 'dayjs'
import notice from '@/utils/notice'

const route = useRoute()
const store = useStore()

watch(
  () => route.meta.title,
  routeTitle => (document.title = `Shop Quế Anh - ${routeTitle}`),
)

// Authenticate
onMounted(() => {
  // Expired access token
  const isExpired = dayjs(localStore.get('accessTokenExpired'))
  if (isExpired.isBefore()) {
    notice.error('Truy cập đã hết hạn, vui lòng đăng nhập lại')
    localStore.remove('user')
    localStore.remove('accessToken')
    localStore.remove('accessTokenExpired')
  }

  // Set authentication
  const user = localStore.get('user')
  const authorized = Boolean(localStore.get('accessToken'))
  if (user) {
    store.commit('user/SET_STATE', {
      user: { ...user, authorized },
    })
  }
})
</script>
