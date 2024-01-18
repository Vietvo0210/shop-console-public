import _ from 'lodash'
import * as apiUpload from '@/services/upload'

export default {
  namespaced: true,
  state: {},
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, payload)
    },
  },
  actions: {
    UPLOAD(context, payload) {
      const data = _.pick(payload, ['file', 'dir', 'is_public'])
      return apiUpload.upload(data, payload.onProgress)
    },
  },
  getters: {},
}
