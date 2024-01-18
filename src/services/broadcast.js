import { createClient } from '@/services/axios'
import { sprintf } from 'sprintf-js'
import { messages } from '@/locales/vi-VN'

export const cancel = id => {
  return createClient()
    .patch(`broadcasts/${id}/cancel`)
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.process_failed)
    })
}

export const _continue = id => {
  return createClient()
    .post(`broadcasts/${id}/continue`)
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.process_failed)
    })
}
