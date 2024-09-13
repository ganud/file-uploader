import express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
import multer = require("multer");
const upload = multer();
import { decode } from "base64-arraybuffer";

router.post(
  "/folder/:id/upload",
  upload.single("files"),
  fileController.folder_upload
);

router.post("/new-folder", fileController.createFolder);

router.get("/folder/:id", fileController.viewFolder);

router.get("/folder/:id/update", fileController.folder_update_get);

router.post("/folder/:id/update", fileController.folder_update_post);

router.get("/folder/:id/delete", fileController.folder_delete_get);

router.post("/folder/:id/delete", fileController.folder_delete_post);

module.exports = router;
