import * as apiDropdown from '@/services/dropdown'
import _ from 'lodash'
import { empty } from '@/utils/variable'
import cast from '@/utils/cast'
import qs from 'qs'

export default {
  namespaced: true,
  state: {
    enums: {},
    fetchingEnums: [],
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, payload)
    },
  },
  actions: {
    LIST({ commit, state, getters }, queries) {
      const { objects } = queries

      const gotEnums = {}
      let newObjects = cast.toArray(objects)

      let conditions = _.omit(queries, ['objects', 'keyword'])
      conditions = _.omitBy(conditions, empty)
      if (empty(conditions)) {
        newObjects = newObjects.filter(object => {
          if (empty(state.enums[object])) {
            return true
          }
          gotEnums[object] = state.enums[object]
          return false
        })
      }

      // Do not need calling
      if (empty(newObjects)) {
        return gotEnums
      }

      queries = _.omitBy(queries, empty)
      queries.objects = newObjects

      const queryParams = qs.stringify(queries, { encode: false })
      if (getters.getFetchingEnums.includes(queryParams)) {
        return []
      }

      return Promise.resolve()
        .then(() => {
          return commit('SET_STATE', {
            fetchingEnums: _.concat(getters.getFetchingEnums, queryParams),
          })
        })
        .then(() => apiDropdown.list(queries))
        .then(({ data }) => {
          const { options, enums: enumObjects } = data

          // Set enum
          const enums = _.cloneDeep(state.enums)
          if (empty(conditions)) {
            _.forEach(options, (opt, object) => {
              if (enumObjects.includes(object)) {
                enums[object] = opt
              }
            })
          }
          commit('SET_STATE', { enums })
          Object.assign(options, gotEnums)

          return options
        })
        .finally(() => {
          return commit('SET_STATE', {
            fetchingEnums: _.without(getters.getFetchingEnums, queryParams),
          })
        })
    },
  },
  getters: {
    getEnum:
      state => (object = null) => {
        const enums = state.enums
        return object ? _.get(enums, object, []) : enums
      },
    getFetchingEnums: state => state.fetchingEnums,
  },
}
