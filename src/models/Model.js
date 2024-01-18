import _ from 'lodash'

export default class Model {
  id = null
  _primaryKey = 'id'

  static name = 'Base'

  static make(...manyProps) {
    return new this().fill(...manyProps)
  }

  get exists() {
    return !!this[this._primaryKey]
  }

  fill(...manyProps) {
    manyProps.forEach(props => {
      _.forEach(_.cloneDeep(props), (v, k) => _.set(this, k, v))
    })
    return this
  }
}
