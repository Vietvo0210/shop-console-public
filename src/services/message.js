import { createClient } from '@/services/axios'
import { sprintf } from 'sprintf-js'
import { messages } from '@/locales/vi-VN'

export const resend = message => {
  return createClient()
    .post(`messages/${message.id}/resend?coll=${message.coll}`)
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.process_failed)
    })
}
