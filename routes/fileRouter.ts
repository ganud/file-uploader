import express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
import multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("egg"), fileController.upload);

router.post("/new-folder", fileController.createFolder);

module.exports = router;
