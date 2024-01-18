import Model from '@/models/Model'

export default class Broadcast extends Model {
  code = null
  title = null
  send_modes = [null]
  template_codes = []
  sender_codes = []
  recipient_collection_id = null
  mcn_messages = null
  mapping_params = []
  status = null
  schedule_send_at = null
  sent_from = null
  sent_to = null
  error = null
  error_message = null
  sent_histories = []
  total = null
  total_detail = {}
  info = {}

  created_ip = null
  created_user = null
  created_at = null
  updated_at = null

  templates = []
  senders = []
  messages = []
  recipient_collection = null

  static name = 'Gửi hàng loạt'
}
