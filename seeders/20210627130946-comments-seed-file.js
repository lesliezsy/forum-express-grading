'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', Array.from({ length: 20 }).map((data) => ({
      text: faker.lorem.sentence(),
      UserId: Math.floor(Math.random() * (15 - 13) + 13),
      RestaurantId: Math.floor(Math.random() * (351 - 301) + 301),
      createdAt: new Date(),
      updatedAt: new Date(),
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
