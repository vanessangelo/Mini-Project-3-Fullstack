const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

const generateJWTToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '7d' }
  );
  return token;
};

module.exports = {
  async registerUser(req, res) {
    const { username, storeName, email, phone, address, password } = req.body;

    try {
      const isExist = await db.User.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { username },
            { storeName },
            { email },
            { phone },
          ],
        },
      });

      if (isExist) {
        res.status(400).send({
          message:
            "username / store name / email / phone number already registered",
        });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = await db.User.create({
        username,
        storeName,
        email,
        phone,
        address,
        password: hashPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.status(201).send({
        message: "Registration success. Welcome!",
        data: {
          username: newUser.username,
          imgProfile: newUser.imgProfile,
          storeName: newUser.storeName,
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
        },
      });
    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;

      const user = await db.User.findOne({
        where: {
            username:username
        },
      });

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          const token = generateJWTToken(user);
          res.json({ message: "Login successful", token, data: user.id });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
