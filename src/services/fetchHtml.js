import { createClient } from '@/services/axios'
import { sprintf } from 'sprintf-js'
import { messages } from '@/locales/vi-VN'

export const get = url => {
  return createClient()
    .get('fetch-html', { params: { url } })
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.fetch_failed, url)
    })
}
