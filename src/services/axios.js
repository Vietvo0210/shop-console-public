import axios from 'axios'
import localStore from 'store'
import store from '@/store'
import { HttpCodeOK, HttpCodeUnauthorized } from '@/services/httpCodes'
import notice from '@/utils/notice'
import { error, warn } from '@/utils/log'
import { name as packageName } from '@/../package.json'

export const createClient = () => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // timeout: 1000,
    headers: { aud: packageName },
  })

  client.interceptors.request.use(request => {
    const accessToken = localStore.get('accessToken')
    if (accessToken) {
      request.headers.Authorization = 'Bearer ' + accessToken
    }
    return request
  })

  client.interceptors.response.use(
    ({ headers, data }) => {
      const contentType = headers['content-type'] ?? ''
      if (!contentType.startsWith('application/json')) {
        return data
      }

      const { status, message } = data
      if (status !== HttpCodeOK) {
        if (Number(status) === HttpCodeUnauthorized) {
          store.dispatch('user/LOGOUT')
        }
        warn(message)
        throw data
      }

      return data
    },
    err => {
      error(err)

      // Errors handling
      const { data } = err.response ?? {}
      if (data) {
        const message = data.replace(/<[^>]*>?/gm, '')
        const options = {}
        if (data.hasOwnProperty('status')) {
          options.key = data.status
        }

        notice.warning(message, options)
      }

      throw err
    },
  )

  return client
}
