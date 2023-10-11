"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: "category_id" });
      Product.belongsToMany(models.User, {
        through: models.Cart,
        foreignKey: "product_id",
        otherKey: "buyer_id",
      });
      Product.belongsToMany(models.Order_detail, {
        through: models.Order_item,
        foreignKey: "product_id",
        otherKey: "orderDetail_id",
      });
      Product.belongsTo(models.User, { foreignKey: "seller_id", as: "Seller" });
    }
  }
  Product.init(
    {
      seller_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      imgProduct: DataTypes.STRING,
      stock: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
