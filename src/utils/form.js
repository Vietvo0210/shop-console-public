import { watch } from 'vue'
import { useRoute } from 'vue-router'
import _ from 'lodash'
import { warn } from '@/utils/log'

export const validateForm = (form, onSuccess, validateCustom = null) => {
  return Promise.all([form.validate(), validateCustom])
    .then(onSuccess)
    .catch(error => {
      if (error) {
        error.errorFields.forEach(({ errors }) => {
          warn(...errors)
        })
      }
    })
}

export const createFormData = (payload = {}) => {
  const formData = new FormData()
  _.forEach(payload, (value, field) => {
    if (!_.isNil(value)) {
      formData.append(field, value)
    }
  })
  return formData
}

export const watchSearchForm = (process, options = {}) => {
  const route = useRoute()
  const oldRoutePath = _.trimEnd(route.path, '/')

  return watch(
    () => route.query,
    () => {
      const currentRoutePath = _.trimEnd(route.path, '/')
      if (_.startsWith(currentRoutePath, oldRoutePath) || _.startsWith(oldRoutePath, currentRoutePath)) {
        process()
      }
    },
    options,
  )
}
