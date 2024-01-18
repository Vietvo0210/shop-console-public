import store from '@/store'
import { isReactive, isRef } from 'vue'
import _ from 'lodash'

export const toggleState = (process, target = null, path = null) => {
  const setState = state => {
    if (_.isNull(target)) {
      return store.dispatch(state ? 'loading/SHOW_LOADING' : 'loading/HIDE_LOADING')
    }
    if (isRef(target)) {
      return (target.value = state)
    }
    if (isReactive(target)) {
      return _.set(target, path ?? 'value', state)
    }
    return (target = state)
  }

  return Promise.resolve()
    .then(() => setState(true))
    .then(process)
    .finally(() => setState(false))
}
