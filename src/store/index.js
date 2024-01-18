import { createStore } from 'vuex'

import dropdown from './dropdown'
import upload from './upload'
import download from './download'
import fetchHtml from './fetchHtml'

export default createStore({
  modules: {
    dropdown,
    upload,
    download,
    fetchHtml,
  },
  state: {},
  mutations: {},
  actions: {},
  getters: {},
})
