import * as apiFetchHtml from '@/services/fetchHtml'

export default {
  namespaced: true,
  state: {
    list: {
      downloads: [],
    },
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, payload)
    },
  },
  actions: {
    GET(context, url) {
      return apiFetchHtml.get(url)
    },
  },
  getters: {
    getList: state => state.list,
  },
}
