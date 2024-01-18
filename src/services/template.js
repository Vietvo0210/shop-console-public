import { createClient } from '@/services/axios'
import { sprintf } from 'sprintf-js'
import { messages } from '@/locales/vi-VN'

export const pullZns = () => {
  return createClient()
    .post('templates/pull-zns')
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.process_failed)
    })
}
