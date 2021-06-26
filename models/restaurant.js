'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 一家餐廳只屬於一個category，一個category可有很多餐廳: 1 to 1 - 1 to M
      Restaurant.belongsTo(models.Category)
      // 一間餐廳有很多評論，但一則評論只屬於一人: 1 to M - 1 to 1
      Restaurant.hasMany(models.Comment)
      // 一間餐廳可以被很多User加到最愛，一個user可有很多最愛的餐廳: 1 to M - 1 to M
      // Rest & User: 中間需透過 Favorite 這張 table 查找關係
      // belongsToMany 表示這是一個多對多關係
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite, // 透過 favorite table去查找餐廳與user之關聯
        foreignKey: 'RestaurantId', // 透過固定 RestaurantId 這欄位去取得 User 內符合條件的users (會拿到和這間餐廳有關係的 UserId)
        as: 'FavoritedUsers' // 改 RestaurantId 稱為 FavoritedUsers
      })
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};