import Model from '@/models/Model'

export default class Sender extends Model {
  code = null
  name = null
  type = null
  platform = null
  info = {}

  created_user = null
  created_at = null
  updated_at = null

  templates = []
  messages = []

  static name = 'Người gửi tin'
}
