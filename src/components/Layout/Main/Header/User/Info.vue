<template>
  <a-dropdown :trigger="['click']">
    <span class="ant-dropdown-link cursor-pointer" @click.prevent>
      <span class="mr-2">{{ '' }}</span>
      <icon-fe type="chevron-down" class="align-middle" />
    </span>
    <template #overlay>
      <a-menu class="min-w-[12rem] divide-y">
        <a-menu-item class="px-4 py-2">
          <div class="flex items-center gap-x-2">
            <icon-fe type="user" />
            {{ '' }} <small class="text-slate-500">({{ '' }})</small>
          </div>
        </a-menu-item>

        <a-menu-item v-if="notBlank('')" class="px-4 py-2">
          <div class="flex items-center gap-x-2">
            <icon-fe type="smartphone" />
            {{ user.phone }}
          </div>
        </a-menu-item>

        <a-menu-item class="px-4 py-2" @click="onLogout">
          <div class="flex items-center gap-x-2">
            <icon-fe type="log-out" />
            Đăng xuất
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
export default {
  name: 'MainHeaderUserInfo',
}
</script>

<script setup>
import IconFe from '@/components/Icon/Fe'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { notBlank } from '@/utils/variable'

const store = useStore()

const user = computed(() => store.getters['user/getUser'])

const onLogout = () => {
  store.dispatch('user/LOGOUT')
}
</script>
