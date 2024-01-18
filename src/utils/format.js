import { DATE_FORMAT_VN, DATETIME_FORMAT_VN, TIME_FORMAT } from '@/utils/consts'
import cast from '@/utils/cast'
import dayjs from 'dayjs'
import { formatPhoneNumber, formatPhoneNumberNational } from '@/utils/phoneNumber'
import { i18n } from '@/Localization'
import _ from 'lodash'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

const format = {
  toDatetime(datetime, fmt = DATETIME_FORMAT_VN) {
    if (_.isNil(datetime)) {
      return null
    }
    const object = dayjs(datetime)
    return object.isValid() ? object.format(fmt) : null
  },
  toDate(datetime, fmt = DATE_FORMAT_VN) {
    return format.toDatetime(datetime, fmt)
  },
  toNumber(number, decimals = 0) {
    return new Intl.NumberFormat(i18n.global.locale.value, {
      maximumFractionDigits: decimals,
    }).format(cast.toNumber(number))
  },
  toCurrency(number, currency = 'VND') {
    return new Intl.NumberFormat(i18n.global.locale.value, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(cast.toNumber(number))
  },
  toDuration(diff, format = TIME_FORMAT) {
    dayjs.extend(duration)
    dayjs.extend(relativeTime)
    return dayjs.duration(diff).format(format)
  },
  toPhoneNumber: formatPhoneNumber,
  toPhoneNumberNational: formatPhoneNumberNational,
}

export default format
