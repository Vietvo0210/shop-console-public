import { createClient } from '@/services/axios'
import { sprintf } from 'sprintf-js'
import { messages } from '@/locales/vi-VN'

export const download = (endpoint, queries = {}) => {
  const client = createClient()
  client.defaults.responseType = 'blob'

  return client.get(endpoint, { params: queries }).catch(response => {
    throw response.message ?? sprintf(messages.notification.export_failed)
  })
}
