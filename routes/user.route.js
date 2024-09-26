const express = require("express");
const { handleSignup, handleLogin } = require("../controllers/user.controller");
// const { homeHandle } = require('../controllers/home.controller')
const { body } = require("express-validator");
const { userModel } = require("../model/registration.model");
const userRouter = express.Router();

// ****************************************************************************************************************
// create a new user

userRouter.post(
  "/signup",
  [
    body("name").notEmpty(),
    body("email", "Enter a valid email")
      .isEmail()
      .custom(async (value) => {
        return userModel.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("E-mail already in use");
          }
        });
      })
      .notEmpty(),
    body("password", "password should be of 8 length")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter") // At least one lowercase letter
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter") // At least one uppercase letter
      .matches(/\d/)
      .withMessage("Password must contain at least one number") // At least one digit
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character") // At least one special character
      .notEmpty(),
    body("location", "add a location ").notEmpty(),
    body("age", "add an age ").notEmpty(),
  ],
  handleSignup
);

// ******************************************************************************************************************
// ====================================================================================================================

// login authentication

userRouter.post(
  "/login",
  [
    body("email", "Enter a valid email")
      .isEmail()
      .custom(async (value) => {
        const user = await userModel.findOne({ email: value });
        if (!user) {
          return Promise.reject("E-mail not registered");
        }
        return true;
      })
      .notEmpty(),

    body("password", "Password should be at least 8 characters long")
      .isLength({ min: 8 })
      .notEmpty()
      .isLength({ min: 8 }),
  ],
  handleLogin
);

// userRouter.get('/home',homeHandle)
module.exports = {
  userRouter,
};
