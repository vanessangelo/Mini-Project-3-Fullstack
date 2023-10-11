'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order_detail.belongsToMany(models.Product, {
        through: models.Order_item,
        foreignKey: "orderDetail_id",
        otherKey: "product_id"
      })
    }
  }
  Order_detail.init({
    buyer_id: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order_detail',
  });
  return Order_detail;
};