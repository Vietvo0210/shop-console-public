import EndUser from '@/models/EndUser'

export default class EndUserZalo extends EndUser {
  is_following = null
  followed_at = null
  unfollowed_at = null
  first_followed_at = null
  first_unfollowed_at = null
  shared_info_at = null
  last_interact = null
}
