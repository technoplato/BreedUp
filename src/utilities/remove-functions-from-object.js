import _ from 'lodash'

export default (obj, filterNull = false) => {
  const noFuncs = _.omitBy(obj, _.isFunction)
  if (!filterNull) {
    return noFuncs
  } else {
    return _.pickBy(noFuncs, _.identity)
  }
}
