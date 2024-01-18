<template>
  <a-menu class="flex justify-center bg-slate-100" mode="horizontal" :selected-keys="[$route.name]">
    <template v-for="route in mainRoutes" :key="route.name">
      <a-menu-item v-if="empty(route.children)" :key="route.name" class="bg-slate-100 gap-5">
        <main-header-nav-link :route="route" />
      </a-menu-item>

      <template v-else>
        <a-sub-menu :key="route.name" class="px-2" @click="onClickSuperMenu(route)">
          <template #icon>
            <icon-fe :type="route.meta?.icon" />
          </template>
          <template #title>{{ route.meta?.title }}</template>

          <div class="divide-y">
            <a-menu-item
              v-for="subRoute in filterRoutes(route.children)"
              :key="subRoute.name"
              class="bg-white h-auto m-0 px-0 py-1"
            >
              <main-header-nav-link :route="subRoute" is-sub />
            </a-menu-item>
          </div>
        </a-sub-menu>
      </template>
    </template>
  </a-menu>
</template>

<script>
export default {
  name: 'MainHeaderNav',
}
</script>

<script setup>
import { blank, empty, notBlank } from '@/utils/variable'
import MainHeaderNavLink from '@/components/Layout/Main/Header/Navigation/Link'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import _ from 'lodash'
import IconFe from '@/components/Icon/Fe'

const router = useRouter()

const filterRoutes = routes => {
  return _.sortBy(_.filter(routes, 'meta.showNav'), 'meta.showNav')
}

const mainRoutes = computed(() => {
  const routes = filterRoutes(router.getRoutes())
  return _.filter(routes, r => blank(_.get(r, 'meta.parent')))
})

const onClickSuperMenu = route => {
  if (notBlank(route.redirect)) {
    router.push(route.redirect)
  }
}
</script>
