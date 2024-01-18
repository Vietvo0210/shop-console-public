import { empty } from '@/utils/variable'
import { mergeObjects } from '@/utils/collection'
import { PAGE_SIZE } from '@/utils/consts'
import { createClient } from '@/services/axios'
import { messages } from '@/locales/vi-VN'

export const list = (object, queries = {}) => {
  if (empty(queries.limit)) {
    queries = mergeObjects(queries, { limit: PAGE_SIZE })
  }
  return createClient()
    .get(object, { params: queries })
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.fetch_failed, object)
    })
}

export const detail = (object, id, queries = {}) => {
  return createClient()
    .get(`${object}/${id}`, { params: queries })
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.fetch_failed, `${object}/${id}`)
    })
}

export const create = (object, payload) => {
  return createClient()
    .post(object, payload)
    .catch(response => {
      const message = response.message ?? sprintf(messages.notification.create_failed, object)
      throw { message, errors: response.errors ?? {} }
    })
}

export const update = (object, id, payload) => {
  return createClient()
    .patch(`${object}/${id}`, payload)
    .catch(response => {
      const message = response.message ?? sprintf(messages.notification.update_failed, `${object}/${id}`)
      throw { message, errors: response.errors ?? {} }
    })
}

export const destroy = (object, id) => {
  return createClient()
    .delete(`${object}/${id}`)
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.delete_failed, `${object}/${id}`)
    })
}
