import { createClient } from '@/services/axios'
import { sprintf } from 'sprintf-js'
import { messages } from '@/locales/vi-VN'

export const cancel = message => {
  return createClient()
    .patch(`plan-messages/${message.id}/cancel?coll=${message.coll}`)
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.process_failed)
    })
}
