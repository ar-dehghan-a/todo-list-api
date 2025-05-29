const schedule = require('node-schedule')
const {checkDayBeforeDueDates, checkDueDateNotifications} = require('./notificationService')

function setupNotificationScheduler() {
  // Run every hour to check for todos due tomorrow
  schedule.scheduleJob('0 * * * *', async function () {
    await checkDayBeforeDueDates()
  })

  // Run every hour to check for todos due today
  schedule.scheduleJob('0 * * * *', async function () {
    await checkDueDateNotifications()
  })

  console.info('Notification scheduler set up - running hourly')
}

module.exports = {setupNotificationScheduler}
