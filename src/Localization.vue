<template>
  <a-config-provider :locale="localeAntd">
    <slot />
  </a-config-provider>
</template>

<script>
import { createI18n } from 'vue-i18n'
import vietnamese from '@/locales/vi-VN'

export default {
  name: 'Localization',
}

const locales = {
  'vi-VN': vietnamese,
}

export const i18n = createI18n({
  legacy: false,
  locale: 'vi-VN',
  fallbackLocale: 'vi-VN',
  messages: {
    'vi-VN': locales['vi-VN'].messages,
  },
})
</script>

<script setup>
import { useStore } from 'vuex'

const store = useStore()
const { locale } = i18n.global

locale.value = 'vi-VN'
const localeAntd = locales[locale.value].localeAntd
</script>
