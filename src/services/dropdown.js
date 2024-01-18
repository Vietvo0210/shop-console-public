import { createClient } from '@/services/axios'
import { sprintf } from 'sprintf-js'
import { messages } from '@/locales/vi-VN'

export const list = queries => {
  return createClient()
    .get('dropdown', { params: queries })
    .catch(response => {
      const { objects } = queries
      throw response.message ?? sprintf(messages.notification.fetch_failed, 'dropdowns ' + objects.join(','))
    })
}
