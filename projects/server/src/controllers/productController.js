const db = require("../models");
const {
  setFromFileNameToDBValueProduct,
  getAbsolutePathPublicFileProduct,
  getFileNameFromDbValue,
} = require("../helper");
const fs = require("fs");

module.exports = {
  async createProduct(req, res) {
    try {
      const { name, price, category_id, description, stock } = req.body;
      let imgProduct = "";

      if (!req.file) {
        return res.status(400).send({
          message: "Missing product image file",
        });
      }

      if (req.file) {
        imgProduct = setFromFileNameToDBValueProduct(req.file.filename);
      }

      const products = await db.Product.create({
        seller_id: req.user.id,
        name,
        price,
        category_id,
        description,
        imgProduct,
        stock,
      });
      console.log(products);

      return res.status(201).send(products);
    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getAllProduct(req, res) {
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: 9,
      search: req.query.search || undefined,
      category: req.query.category || undefined,
      sortAlphabet: req.query.sortAlphabet,
      sortPrice: req.query.sortPrice,
    };

    try {
      const where = {};
      const order = [];

      where.isActive = 1;
      where.stock = {
        [db.Sequelize.Op.gt]: 0
      };
      

      if (pagination.search) {
        where.name = {
          [db.Sequelize.Op.like]: `%${pagination.search}%`,
        };
      }

      if (pagination.category) {
        where.category_id = pagination.category;
      }
      if (pagination.sortAlphabet) {
        if (pagination.sortAlphabet.toUpperCase() === "DESC") {
          order.push(["name", "DESC"]);
        } else {
          order.push(["name", "ASC"]);
        }
      }

      if (pagination.sortPrice) {
        if (pagination.sortPrice.toUpperCase() === "DESC") {
          order.push(["price", "DESC"]);
        } else {
          order.push(["price", "ASC"]);
        }
      }

      const results = await db.Product.findAndCountAll({
        where,
        include: [
          {
            model: db.Category,
          },
          {
            model: db.User,
            as: "Seller",
            attributes: ["username", "storeName"],
          },
        ],
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage,
        order,
      });

      const totalCount = results.count;
      pagination.totalData = totalCount;

      if (results.rows.length === 0) {
        return res.status(200).send({
          message: "No products found",
        });
      }

      res.send({
        message: "Successfully retrieved products",
        pagination,
        data: results.rows.map((product) => {
          return {
            id: product.id,
            seller: {
              seller_id: product.seller_id,
              name: product.Seller.username,
              store: product.Seller.storeName,
            },
            name: product.name,
            price: product.price,
            description: product.description,
            imgProduct: product.imgProduct,
            stock: product.stock,
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            category: {
              id: product.Category.id,
              name: product.Category.name,
            },
          };
        }),
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  async getAllCategory(req, res) {
    try {
      const category = await db.Category.findAll({
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
      });

      return res
        .status(200)
        .send({ message: "Successfully get all categories", data: category });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },

  async createCategory(req, res) {
    const user_id = req.user.id;
    try {
      const { name } = req.body;

      await db.Category.create({
        user_id,
        name,
      });

      return res
        .status(201)
        .send({ message: "Successfully created new category" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },

  async getProductById(req, res) {
    try {
      const product = await db.Product.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: db.Category,
          },
          {
            model: db.User,
            as: "Seller",
            attributes: ["username", "storeName"],
          },
        ],
      });

      if (!product) {
        return res.status(404).send({
          message: "Product not found",
        });
      }

      res.send({
        message: "Successfully retrieved product",
        data: {
          id: product.id,
          seller: {
            seller_id: product.seller_id,
            name: product.Seller.username,
            store: product.Seller.storeName,
          },
          name: product.name,
          price: product.price,
          description: product.description,
          imgProduct: product.imgProduct,
          stock: product.stock,
          isActive: product.isActive,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          category: {
            id: product.Category.id,
            name: product.Category.name,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  async productAction(req, res) {
    const id = parseInt(req.params.id);
    const action = req.params.action;

    try {
      const getProduct = await db.Product.findOne({
        where: {
          id,
          seller_id: req.user.id,
        },
      });

      if (!getProduct) {
        return res.status(400).send({
          message: "Product doesn't exist",
        });
      }

      switch (action) {
        case "activate":
          if (getProduct.isActive) {
            return res.status(400).send({
              message: "Product is already active",
            });
          }

          getProduct.isActive = true;
          await getProduct.save();

          return res.status(200).send({
            message: "Product activated successfully",
          });

        case "deactivate":
          if (!getProduct.isActive) {
            return res.status(400).send({
              message: "Product is already inactive",
            });
          }

          getProduct.isActive = false;
          await getProduct.save();

          return res.status(200).send({
            message: "Product deactivated successfully",
          });

        default:
          return res.status(400).send({
            message: "Invalid action",
          });
      }
    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async deleteProduct(req, res) {
    try {
      const product = await db.Product.findOne({
        where: {
          id: parseInt(req.params.id),
          seller_id: req.user.id,
        },
      });

      if (!product) {
        return res.status(404).send({
          message: "Product not found",
        });
      }

      const imgProduct = product.getDataValue("imgProduct");
      const oldFilename = getFileNameFromDbValue(imgProduct);
      if (oldFilename) {
        fs.unlinkSync(getAbsolutePathPublicFileProduct(oldFilename));
      }

      await product.destroy();

      return res.status(200).send({
        message: "Product successfully deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },

  async getTopSellingProduct(req, res) {
    try {
      const categoryId = Number(req.body.categoryId);
  
      let productInclude = {
        model: db.Product,
        as: "product",
        where: {
          [db.Sequelize.Op.and]: [
            categoryId ? { category_id: categoryId } : {},
            { isActive: 1 },
          ],
        },
        include: {
          model: db.Category,
          attributes: ["name"],
        },
      };
  
      const topSellingProducts = await db.Order_item.findAll({
        include: [productInclude],
        group: ["product_id"],
        attributes: [
          "product_id",
          [
            db.sequelize.fn("SUM", db.sequelize.col("quantity")),
            "total_quantity",
          ],
        ],
        order: [[db.sequelize.fn("SUM", db.sequelize.col("quantity")), "DESC"]],
        limit: 7, 
      });
  
      if (topSellingProducts.length === 0) {
        return res.status(400).send({
          message: "No products found",
        });
      }
  
      return res.status(200).send({
        message: "Successfully retrieved top-selling products",
        data: topSellingProducts,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
  }
  
};
