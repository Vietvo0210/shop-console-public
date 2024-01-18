import Model from '@/models/Model'

export default class BlacklistRecipient extends Model {
  phone = null
  blocked_from = null
  blocked_to = null

  created_user = null
  created_at = null

  static name = 'Người nhận tin bị chặn'
}
