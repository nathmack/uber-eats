// functions
const group = (groupFunction, defaulyValues) => data.orders.reduce((prev, order) => {
  const groupIndex = groupFunction(order)

  return { ...prev, [groupIndex]: (prev[groupIndex] || []).concat(order) }
}, defaulyValues || {})
const countGroup = (data, groupFunction) => data.reduce((prev, order) => {
  const groupIndex = groupFunction(order)

  return {...prev, [groupIndex]: (prev[groupIndex] || 0) + 1 }
}, {})
const dateSort = (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
const arraySort = (a, b) => b[1].length - a[1].length
const numberSort = (a, b) => a - b
const toFloat = a => parseFloat(a, 10)

// date / time
Date.prototype.getWeek = function(){
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
}
const daysToMs = days => 1000 * 60 * 60 * 24 * days
const msToDays = ms => (ms / 1000 / 60 / 60 / 24).toFixed(1)
const displayLongDate = date => `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`
const displayShortDate = date => `${months[date.getMonth()]} ${date.getFullYear()}`
const getFirstWeekDay = date => {
  const day = new Date(date)
  const time = day.getTime()
  const weekDay = day.getDay()

  return new Date(time - daysToMs(weekDay))
}
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const monthsShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

// labels
const joinString = string => string.split(' ').join('-').replace(/[&\(\),:Â®\.]/g, '')
const defaultMouseoutLabel = (selection, d, label) => selection.text(label)
const defaultFormatLabel = (label, limit = 16) => {
  return `${label.slice(0, limit)}${label.slice(limit).length ? '...' : ''}`
}

// Statistics
const getSpendTotals = orders => orders.map(order => {
  const paymentInfo = order.checkoutInfo.find(info => info.label === 'Total') || {}
  return paymentInfo.rawValue || 0
})
const formatDollars = number => `$${number.toFixed(2)}`
const getItems = orders => orders.reduce((prev, order) => [...prev, ...order.items], [])
const orderItemCounts = orders => orders.map(order => order.items.length)
const getOrderTimes = orders => orders.map(order => order.completionStatus.completionTime)

// data
const filterOutliers = data => {
  const sortedDate = data.sort(numberSort)
  const q1 = d3.quantile(sortedDate, 0.25)
  const q3 = d3.quantile(sortedDate, 0.75)
  const interquartileRange = q3 - q1
  const upperFence = q3 + (interquartileRange * 1.5)
  const lowerFence = q1 - (interquartileRange * 1.5) > 0 ? q3 - (interquartileRange * 1.5) : 0

  return sortedDate.filter(datum => datum > lowerFence && datum < upperFence)
}
