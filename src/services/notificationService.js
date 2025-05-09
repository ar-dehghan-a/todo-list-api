const webpush = require('web-push')
const {Op} = require('sequelize')
const {User} = require('../models/User')
const {Todo} = require('../models/Todo')

webpush.setVapidDetails(
  'mailto:info@iamsorry.ir',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
)

// Send push notification to a user
async function sendPushNotification(userId, payload) {
  try {
    const user = await User.findByPk(userId)
    if (!user || !user.pushSubscription) return

    const subscription = JSON.parse(user.pushSubscription)
    await webpush.sendNotification(subscription, JSON.stringify(payload))

    return true
  } catch (error) {
    console.error('Failed to send push notification:', error)
    return false
  }
}

// Store push subscription for a user
async function saveUserSubscription(userId, subscription) {
  try {
    await User.update({pushSubscription: JSON.stringify(subscription)}, {where: {id: userId}})
    return true
  } catch (error) {
    console.error('Error saving subscription:', error)
    return false
  }
}

// Check for todos with due dates tomorrow and send notifications
async function checkDayBeforeDueDates() {
  try {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const tomorrowEnd = new Date(tomorrow)
    tomorrowEnd.setHours(23, 59, 59, 999)

    const todosWithDueTomorrow = await Todo.findAll({
      where: {
        isCompleted: false,
        dayBeforeNotificationSent: false,
        dueDate: {
          [Op.between]: [tomorrow, tomorrowEnd],
        },
      },
      include: [
        {
          model: User,
          as: 'userDetails',
          attributes: ['id'],
        },
      ],
    })

    console.info(`Found ${todosWithDueTomorrow.length} todos due tomorrow`)

    for (const todo of todosWithDueTomorrow) {
      const success = await sendPushNotification(todo.userId, {
        title: 'Task Due Tomorrow',
        body: `"${todo.title}" is due tomorrow`,
        tag: `todo-${todo.id}-day-before`,
        data: {
          todoId: todo.id,
          url: `/todos/${todo.id}`,
        },
      })

      if (success) {
        await todo.update({dayBeforeNotificationSent: true})
      }
    }
  } catch (error) {
    console.error('Error checking day before due dates:', error)
  }
}

// Check for todos with due dates today and send notifications
async function checkDueDateNotifications() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    const todosDueToday = await Todo.findAll({
      where: {
        isCompleted: false,
        dueDateNotificationSent: false,
        dueDate: {
          [Op.between]: [today, todayEnd],
        },
      },
      include: [
        {
          model: User,
          as: 'userDetails',
          attributes: ['id'],
        },
      ],
    })

    console.info(`Found ${todosDueToday.length} todos due today`)

    for (const todo of todosDueToday) {
      const success = await sendPushNotification(todo.userId, {
        title: 'Task Due Today',
        body: `"${todo.title}" is due today`,
        tag: `todo-${todo.id}-due-today`,
        data: {
          todoId: todo.id,
          url: `/todos/${todo.id}`,
        },
      })

      if (success) {
        await todo.update({dueDateNotificationSent: true})
      }
    }
  } catch (error) {
    console.error('Error checking due date notifications:', error)
  }
}

module.exports = {
  sendPushNotification,
  saveUserSubscription,
  checkDayBeforeDueDates,
  checkDueDateNotifications,
}
