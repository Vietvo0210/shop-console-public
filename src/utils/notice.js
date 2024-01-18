import { notification } from 'ant-design-vue'
import { debug, error, warn } from '@/utils/log'
import _ from 'lodash'
import { isVNode } from 'vue'

const call = (type, message, options = {}) => {
  if (_.isString(message) || isVNode(message)) {
    notification[type]({ message, ...options })
  }
}

const notice = {
  success(message, options = {}) {
    debug(message)
    return call('success', message, options)
  },
  error(message, options = {}) {
    error(message)
    return call('error', message, options)
  },
  info(message, options = {}) {
    debug(message)
    return call('info', message, options)
  },
  warning(message, options = {}) {
    warn(message)
    return call('warning', message, options)
  },
}

export default notice
