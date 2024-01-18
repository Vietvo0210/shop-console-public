import { createFormData } from '@/utils/form'
import { createClient } from '@/services/axios'
import { sprintf } from 'sprintf-js'
import { messages } from '@/locales/vi-VN'

export const upload = (data, onProgress) => {
  const formData = createFormData(data)

  return createClient()
    .post('upload', formData, {
      onUploadProgress: event => onProgress((event.loaded / event.total) * 100),
    })
    .catch(response => {
      throw response.message ?? sprintf(messages.notification.upload_failed)
    })
}
