'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add dueDate to Todos
    await queryInterface.addColumn('Todos', 'dueDate', {
      type: Sequelize.DATE,
      allowNull: true,
    })

    await queryInterface.addColumn('Todos', 'dayBeforeNotificationSent', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })

    await queryInterface.addColumn('Todos', 'dueDateNotificationSent', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })

    // Add pushSubscription to Users
    await queryInterface.addColumn('Users', 'pushSubscription', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeColumn('Todos', 'dueDate')
    await queryInterface.removeColumn('Todos', 'dayBeforeNotificationSent')
    await queryInterface.removeColumn('Todos', 'dueDateNotificationSent')
    await queryInterface.removeColumn('Users', 'pushSubscription')
  },
}
