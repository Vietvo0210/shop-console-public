import Model from '@/models/Model'
import { ZMSMessageElementsDefaults, ZMSMessageType } from '@/utils/enums'

export default class Template extends Model {
  code = null
  name = null
  send_mode = null
  params = []
  message = {
    type: ZMSMessageType.TRANSACTION,
    text: '',
    elements: ZMSMessageElementsDefaults.List,
    buttons: [],
  }
  sender_code = null

  created_user = null
  created_at = null
  updated_at = null

  sender = null
  messages = []

  static name = 'Mẫu tin'
}
