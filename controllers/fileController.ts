import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");

// Post request for file upload
exports.upload = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.file);
  res.render("upload", { errors: false, user: req.user });
});
