import express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/login", userController.user_login_get);

router.get("/sign-up", userController.user_signup_get);

router.post("/sign-up", userController.user_create_post);

module.exports = router;
