import Model from '@/models/Model'

export default class User extends Model {
  username = null
  name = null
  password = null
  gender = null
  email = null
  birthday = null
  avatar = null

  created_user = null
  created_at = null
  updated_at = null

  authorized = false

  static name = 'Nhân viên'
}
