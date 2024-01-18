import _ from 'lodash'

export const removeArrayIndex = (array, index) => {
  array.splice(index, 1)
  return array
}

export const uniqueArray = array => _.toArray(new Set(array))

export const insertArray = (array, index, value) => {
  array.splice(index, 0, value)
}

export const moveArrayElement = (array, fromIndex, toIndex) => {
  if (toIndex === -1) {
    return array
  }
  const elementChange = array.splice(fromIndex, 1)[0]
  array.splice(toIndex, 0, elementChange)
}

export const mergeObjects = (...objects) => _.extend({}, ...objects)

export const setMany = (object, values) => {
  _.each(values, (value, path) => _.set(object, path, value))
  return object
}

export const walkRecursive = (object, callback) => {
  if (typeof object !== 'object') {
    return callback(object)
  }
  return _.mapValues(object, value => walkRecursive(value, callback))
}
