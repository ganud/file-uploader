import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

// Post request for file upload
exports.upload = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.file);
  res.render("upload", { errors: false, user: req.user });
});

// Post request for new folder
exports.createFolder = asyncHandler(async (req: Request, res: Response) => {
  if (req.user === undefined) {
    res.render("login");
  } else {
    await db.createFolder(req.body.folder_name, req.user.id);
    // Render index with saved folders and newly created folder
    const folders = await db.getFolders(req.user.id);
    res.render("index", { user: req.user, folders: folders });
  }
});

// Get request for folder view
exports.viewFolder = asyncHandler(async (req: Request, res: Response) => {
  if (req.user === undefined) {
    res.render("login");
  } else {
    // Render index with saved folders and newly created folder
    const folder = await db.findFolder(parseInt(req.params.id));
    res.render("folder", { user: req.user, folder: folder });
  }
});

// Get request for rename folder form
exports.folder_update_get = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user === undefined) {
      res.render("login");
    } else {
      const folder = await db.findFolder(parseInt(req.params.id));
      res.render("rename_folder", { user: req.user, folder: folder });
    }
  }
);

// Post request for folder update
exports.folder_update_post = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user === undefined) {
      res.render("login");
    } else {
      // Update folder and redirect.
      await db.updateFolder(parseInt(req.params.id), req.body.folder_name);
      res.redirect("/");
    }
  }
);
