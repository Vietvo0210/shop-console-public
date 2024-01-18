import { blank } from '@/utils/variable'

const DIGIT11_TO_10_PREFIX = {
  // MobiFone
  120: 70,
  121: 79,
  122: 77,
  126: 76,
  128: 78,

  // VinaPhone
  123: 83,
  124: 84,
  125: 85,
  127: 81,
  129: 82,

  // Viettel
  162: 32,
  163: 33,
  164: 34,
  165: 35,
  166: 36,
  167: 37,
  168: 38,
  169: 39,

  // Vietnamobile
  186: 56,
  188: 58,

  // Gmobile
  199: 59,
}

const DIGIT10_PREFIX
  = '89,90,93,70,79,77,76,78' // MobiFone
  + '88,91,94,83,84,85,81,82' // VinaPhone
  + '86,96,97,98,32,33,34,35,36,37,38,39' // Viettel
  + '92,56,58' // Vietnamobile
  + '99,59' // Gmobile

const LANDLINE_PREFIX
  = '296,254,209,204,291,222,275,256,274,271,252,290,292,206,236,262,261,215,251,277,269,226,24,'
  + '239,220,225,293,28,221,258,297,260,213,263,205,214,272,228,238,259,229,257,232,235,255,203,233,299,212,276,227,'
  + '208,237,234,273,294,207,270,216'

export const formatPhoneNumber = phoneNumber => {
  let converted = phoneNumber
  if (blank(converted)) {
    return null
  }

  // Remove prefix + or 0, and delimiter
  converted = converted.replace(/^[+0]+| ?[.-] ?/g, '')

  // Remove prefix 84 (VN) except vina 84xxxxxxx
  if (!/^840\d{7}$/.test(converted)) {
    converted = converted.replace(/^840?/, '')
  }

  // Convert prefix
  Object.keys(DIGIT11_TO_10_PREFIX).some(from => {
    const to = DIGIT11_TO_10_PREFIX[from]
    const pattern = new RegExp(`^${from}(\\d{7})$`)
    if (pattern.test(converted)) {
      converted = converted.replace(pattern, to + '$1')
      return true
    }
    return false
  })

  if (/^\d{9,10}$/.test(converted)) {
    converted = `0${converted}`
  }

  return converted
}

export const formatPhoneNumberNational = (phoneNumber, prefixPlus = false) => {
  let formatted = formatPhoneNumber(phoneNumber)
  if (formatted === null) {
    return null
  }

  formatted = formatted.replace(/^0/, '84')
  if (prefixPlus) {
    formatted = `+${formatted}`
  }
  return formatted
}

export const isLandlineNumber = phoneNumber => {
  const converted = formatPhoneNumber(phoneNumber)
  return LANDLINE_PREFIX.split(',').some(prefix => {
    return new RegExp(`^0${prefix}\\d+`).test(converted)
  })
}

export const isMobileNumber = phoneNumber => {
  if (isLandlineNumber(phoneNumber)) {
    return false
  }
  return /^0\d{9}$/.test(formatPhoneNumber(phoneNumber))
}

export const isPhoneNumber = phoneNumber => {
  return isLandlineNumber(phoneNumber) || isMobileNumber(phoneNumber)
}
