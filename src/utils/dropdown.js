import _ from 'lodash'
import store from '@/store'
import { blank, empty, notEmpty } from '@/utils/variable'
import { removeVnSign } from '@/utils/locale/vi'
import cast from '@/utils/cast'
import notice from '@/utils/notice'
import { uniqueArray } from '@/utils/collection'

export const convert2DropdownOptions = (enums, valueAsNumber = false) => {
  return _.map(enums, (label, value) => {
    if (valueAsNumber) {
      value = cast.toNumber(value)
    }
    return { label, value }
  })
}

export const getDropdownProp = (options = [], value, prop = 'label') => {
  const option = _.find(options, ['value', value])
  return option ? option[prop] : null
}

export const filterDropdownOption = (input, option) => {
  const lowerLabel = removeVnSign(option?.label).toLowerCase()
  const lowerInput = removeVnSign(input).toLowerCase()
  return lowerLabel.includes(lowerInput)
}

export const fetchDropdowns = dropdowns => {
  return Promise.resolve().then(() => {
    dropdowns = cast.toArray(dropdowns)
    if (empty(dropdowns)) {
      return true
    }

    const disableDropdowns = state => {
      return dropdowns.forEach(dropdown => dropdown.setState({ disabled: state }))
    }

    const objects = uniqueArray(dropdowns.map(dropdown => dropdown.getObject()))
    const queries = { objects }
    if (dropdowns.length === 1) {
      const { keyword, conditions } = dropdowns[0].getState()
      Object.assign(queries, { keyword, ...conditions })
    }

    return Promise.resolve()
      .then(() => disableDropdowns(true))
      .then(() => {
        if (dropdowns.length === 1) {
          const { conditions, belongsWithConditions } = dropdowns[0].getState()
          if (belongsWithConditions && notEmpty(conditions) && _.every(conditions, blank)) {
            return []
          }
        }

        return store.dispatch('dropdown/LIST', queries)
      })
      .then(options => {
        dropdowns.forEach(dropdown => {
          const newOptions = options[dropdown.getObject()] ?? []
          dropdown.setState({ options: newOptions })

          const optionValues = dropdown.getValue()
          if (_.isNil(optionValues)) {
            return
          }

          if (_.isArray(optionValues)) {
            const values = _.map(newOptions, 'value')
            const newValue = optionValues.filter(item => values.includes(item))
            return dropdown.setValue(newValue)
          }

          if (!_.some(newOptions, ['value', optionValues])) {
            dropdown.setValue(null)
          }
        })
        return options
      })
      .catch(notice.error)
      .finally(() => disableDropdowns(false))
  })
}
