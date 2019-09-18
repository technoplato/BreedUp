import moment from 'moment'
const format = 'dddd, MMMM Do [at] h:mm a'
export default utc => moment(utc).format(format)
