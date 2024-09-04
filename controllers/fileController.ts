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
    res.render("/login");
  } else {
    const user = await db.extractUser(req.user);
    console.log(req.body);
    console.log(user.id);
    const folder = await db.createFolder(req.body.folder_name, user.id);
    res.render("index", { user: req.user });
  }
});
