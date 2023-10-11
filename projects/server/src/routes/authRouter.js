const authController = require("../controllers/authController");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const router = require("express").Router();

router.post(
  "/register",
  validatorMiddleware.validateRegistration,
  authController.registerUser
);

router.post(
  "/login",
  validatorMiddleware.validateLogin,
  authController.loginUser);

module.exports = router;
