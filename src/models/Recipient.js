import Model from '@/models/Model'

export default class Recipient extends Model {
  coll = null

  phone = null
  tracking = null
  collection_id = null
  params = []
  info = {}

  created_ip = null
  created_user = null
  created_at = null

  collection = null

  static name = 'Người nhận tin'
}
