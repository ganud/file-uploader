import express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/login", userController.user_login_get);

module.exports = router;
