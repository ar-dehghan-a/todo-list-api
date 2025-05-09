const schedule = require('node-schedule')
const {checkDayBeforeDueDates, checkDueDateNotifications} = require('./notificationService')

function setupNotificationScheduler() {
  // Run daily at 9:00 AM to check for todos due tomorrow
  schedule.scheduleJob('0 9 * * *', async function () {
    await checkDayBeforeDueDates()
  })

  // Run daily at 9:00 AM to check for todos due today
  schedule.scheduleJob('0 9 * * *', async function () {
    await checkDueDateNotifications()
  })

  console.info('Notification scheduler set up')
}

module.exports = {setupNotificationScheduler}
