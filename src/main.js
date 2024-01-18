import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App'
import { i18n } from './Localization'
import antdv from 'ant-design-vue'
import vueFeather from 'vue-feather'

window.global ||= window

createApp(App).use(router).use(store).use(i18n).use(antdv).component(vueFeather.name, vueFeather).mount('#app')
