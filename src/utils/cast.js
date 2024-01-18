import _ from 'lodash'
import { blank } from '@/utils/variable'
import dayjs from 'dayjs'

export class Dayjs {
  static name = 'Dayjs'
}

const cast = {
  toString(value, castWhenBlank = true) {
    return blank(value) && !castWhenBlank ? value : String(value ?? '')
  },
  toNumber(value, castWhenBlank = true) {
    return blank(value) && !castWhenBlank ? value : +(value ?? 0)
  },
  toBoolean(value, castWhenBlank = true) {
    return blank(value) && !castWhenBlank ? value : !!(value ?? false)
  },
  toDayjs(value, castWhenBlank = true) {
    return blank(value) && !castWhenBlank ? value : dayjs(value)
  },

  toArray(value, rejectBlank = true) {
    let array = _.castArray(value)
    if (rejectBlank) {
      array = _.reject(array, blank)
    }
    return array
  },
  toArrayAsType(value, type, rejectBlank = true) {
    return _.map(cast.toArray(value, rejectBlank), cast['to' + type.name])
  },
  toArrayBySeparator(string, separator = ',') {
    return cast.toArray(cast.toString(string).split(separator))
  },
}

export default cast
