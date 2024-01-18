import { createClient } from '@/services/axios'
import localStore from 'store'
import { sprintf } from 'sprintf-js'
import { ifBlank } from '@/utils/variable'

export const login = payload => {
  return createClient()
    .post(import.meta.env.VITE_AUTH_API_URL + '/auth/login', {
      ...payload,
      media_code: ifBlank(MEDIA_CODE, import.meta.env.VITE_MEDIA_CODE),
    })
    .then(response => {
      const { token: accessToken, expired_at: expiredAt, user } = response.data
      if (accessToken) {
        user.authorized = true
        localStore.set('accessToken', accessToken)
        localStore.set('accessTokenExpired', expiredAt)
        localStore.set('user', user)
      }
      return user
    })
    .catch(response => {
      const message = response.message ?? sprintf(response.errors)
      throw { message, errors: response.errors ?? {} }
    })
}

export const logout = () => {
  localStore.remove('accessToken')
  localStore.remove('user')
}
