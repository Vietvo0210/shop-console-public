import { isMobileNumber, isPhoneNumber } from '@/utils/phoneNumber'

export const validatePhoneNumber = (rules, phoneNumber) => {
  return new Promise((resolve, reject) => {
    if (phoneNumber === '' || isPhoneNumber(phoneNumber)) {
      return resolve()
    }
    return reject('${label} phải là một số điện thoại hợp lệ')
  })
}

export const validateMobileNumber = (rules, phoneNumber) => {
  return new Promise((resolve, reject) => {
    if (phoneNumber === '' || isMobileNumber(phoneNumber)) {
      return resolve()
    }
    return reject('${label} phải là một số di động hợp lệ')
  })
}
