import Model from '@/models/Model'

export default class Download extends Model {
  type = null
  status = null
  progress = null
  total = null
  downloaded_from = null
  downloaded_to = null
  conditions = null
  error_message = null
  filepath = null
  filename = null

  created_user = null
  created_at = null
  updated_at = null

  static name = 'Tải xuống'
}
