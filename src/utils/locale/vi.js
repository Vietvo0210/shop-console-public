import localeVi from 'ant-design-vue/es/date-picker/locale/vi_VN'
import _ from 'lodash'

export const datePickerVi = () => {
  const locale = _.cloneDeep(localeVi)
  locale.lang = {
    ...locale.lang,
    shortWeekDays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    shortMonths: _.range(1, 13).map(i => 'Th.' + i),
  }
  return locale
}

export const removeVnSign = text => {
  let converted = text

  converted = converted.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/gu, 'a')
  converted = converted.replace(/[èéẹẻẽêềếệểễ]/gu, 'e', converted)
  converted = converted.replace(/[ìíịỉĩ]/gu, 'i', converted)
  converted = converted.replace(/[òóọỏõôồốộổỗơờớợởỡ]/gu, 'o', converted)
  converted = converted.replace(/[ùúụủũưừứựửữ]/gu, 'u', converted)
  converted = converted.replace(/[ỳýỵỷỹ]/gu, 'y', converted)
  converted = converted.replace(/đ/gu, 'd', converted)
  converted = converted.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/gu, 'A', converted)
  converted = converted.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/gu, 'E', converted)
  converted = converted.replace(/[ÌÍỊỈĨ]/gu, 'I', converted)
  converted = converted.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/gu, 'O', converted)
  converted = converted.replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/gu, 'U', converted)
  converted = converted.replace(/[ỲÝỴỶỸ]/gu, 'Y', converted)
  converted = converted.replace(/Đ/gu, 'D', converted)

  return converted
}
