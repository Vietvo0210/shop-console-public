import { notBlank } from '@/utils/variable'
import _ from 'lodash'

export default class ModelCollection {
  static make(model, items, path = null, defaultValue = null) {
    if (notBlank(path)) {
      _.set(items, path, this.make(model, _.get(items, path, defaultValue)))
      return items
    }
    return items.map(item => model.make(item))
  }
}
