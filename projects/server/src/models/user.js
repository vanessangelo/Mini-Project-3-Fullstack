"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order_detail, { foreignKey: "buyer_id" });
      User.belongsToMany(models.Product, {
        through: models.Cart,
        foreignKey: "buyer_id",
        otherKey: "product_id",
      });
      User.hasMany(models.Category, { foreignKey: "user_id" });
      User.hasMany(models.Product, { foreignKey: "seller_id" });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      imgProfile: DataTypes.STRING,
      storeName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
