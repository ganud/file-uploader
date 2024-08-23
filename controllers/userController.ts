import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const { body, validationResult, check } = require("express-validator");
var bcrypt = require("bcryptjs");
import passport = require("passport");

// Render the user login form on GET
exports.user_login_get = asyncHandler(async (req: Request, res: Response) => {
  res.render("login", { errors: false });
});

exports.user_login = asyncHandler(async (req: Request, res: Response) => {
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })(req, res);
});

exports.user_logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: Error) => {
      if (err) {
        return next(err);
      } else {
        res.redirect("/");
      }
    });
  }
);
