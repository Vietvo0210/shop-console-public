import { createClient } from '@/services/axios'
import { sprintf } from 'sprintf-js'
import { messages } from '@/locales/vi-VN'

export const upsert = payload => {
  return createClient()
    .post('blacklist-recipients/upsert', payload)
    .catch(response => {
      const message = response.message ?? sprintf(messages.notification.update_failed, 'blacklist-recipients')
      throw { message, errors: response.errors ?? {} }
    })
}
