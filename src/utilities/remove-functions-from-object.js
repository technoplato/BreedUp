import _ from 'lodash'

export default (obj, filterNull = false) => {
  return JSON.parse(JSON.stringify(obj))
}
