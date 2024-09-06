import express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
import multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("egg"), fileController.upload);

router.post("/new-folder", fileController.createFolder);

router.get("/folder/:id", fileController.viewFolder);

router.get("/folder/:id/update", fileController.folder_update_get);

router.post("/folder/:id/update", fileController.folder_update_post);

module.exports = router;
