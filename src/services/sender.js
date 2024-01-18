import { createClient } from '@/services/axios'
import { sprintf } from 'sprintf-js'
import { messages } from '@/locales/vi-VN'

export const znsQuota = id => {
  return createClient()
    .get(`senders/${id}/zns/quota`)
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.fetch_failed, 'ZNS Quota')
    })
}

export const znsRsa = id => {
  return createClient()
    .get(`senders/${id}/zns/rsa`)
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.fetch_failed, 'ZNS RSA')
    })
}
