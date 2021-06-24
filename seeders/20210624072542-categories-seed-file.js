'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories',
      ['Chinese', 'Japanese', 'Italian', 'Mexican', 'American', 'Vegetarian', 'Fusion']
      .map((item, index) =>
        ({
          // 遠端佈署時使用 clearDB，而 clearDB 的 id 跳號採用有間隔設計。
          // 因此在計算資料 id 時，原則採用和遠端資料庫 clearDB 一致的設計，也就是每次跳號的間隔為 10。
          id: index * 10 + 1,
          name: item,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};