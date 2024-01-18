import Model from '@/models/Model'
import { notBlank } from '@/utils/variable'

export default class Message extends Model {
  coll = null

  send_modes = []
  sender_codes = []
  customer_id = null
  mcn_recipients = []
  recipient_id = null
  phone = null
  template_codes = []
  tracking = null
  recipient_collection_id = null
  broadcast_id = null
  sent_modes = []
  sent_histories = []
  sent_at = null
  error = null
  error_message = null
  message_id = null
  received_at = null
  seen_at = null
  zns_rsa = false

  created_ip = null
  created_user = null
  created_at = null
  updated_at = null

  broadcast = null
  customer = null
  recipient = null
  recipient_collection = null
  senders = []
  templates = []

  static name = 'Tin nhắn'

  get successful() {
    return notBlank(this.error) && Number(this.error) === 0
  }
}
