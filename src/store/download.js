import * as apiResource from '@/services/apiResource'
import ModelCollection from '@/models/Collection'
import Download from '@/models/Download'
import * as apiDownload from '@/services/download'

const model = Download

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
    LIST(context, queries = {}) {
      return apiResource.list('downloads', queries).then(response => {
        ModelCollection.make(model, response, 'data.downloads')
        return response.data
      })
    },
    LIST_PAGE({ commit, dispatch }, queries = {}) {
      return dispatch('LIST', queries).then(data => commit('SET_STATE', { list: data }))
    },
    CREATE(context, payload) {
      return apiResource.create('downloads', payload)
    },
    DELETE(context, id) {
      return apiResource.destroy('downloads', id)
    },
    DOWNLOAD(context, id) {
      return apiDownload.download(`downloads/${id}/download`)
    },
  },
  getters: {
    getList: state => state.list,
  },
}
