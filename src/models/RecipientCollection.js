import Model from '@/models/Model'

export default class RecipientCollection extends Model {
  code = null
  name = null
  mcn_recipients = null
  type = null
  filepath = null
  filename = null
  file_definition = {
    total_row: null,
    total_column: null,
    start_row: null,
    end_row: null,
    phone_column: null,
    tracking_column: null,
    skip_invalid_phone: false,
    skip_blacklist_phone: true,
  }
  status = null
  imported_from = null
  imported_to = null
  error_messages = null
  imported_histories = []
  total = null

  created_ip = null
  created_user = null
  created_at = null
  updated_at = null

  broadcasts = []
  messages = []

  static name = 'Tập người nhận tin'
}
