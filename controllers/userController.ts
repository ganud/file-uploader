import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const { body, validationResult, check } = require("express-validator");
var bcrypt = require("bcryptjs");
import passport = require("passport");
const db = require("../db/queries");

// Render the index
exports.index = asyncHandler(async (req: Request, res: Response) => {
  res.render("index", { errors: false, user: req.user });
});

// Render the user login form on GET
exports.user_login_get = asyncHandler(async (req: Request, res: Response) => {
  res.render("login", { errors: false, user: req.user });
});

// Render the user signup form on GET
exports.user_signup_get = asyncHandler(async (req: Request, res: Response) => {
  res.render("signup", { errors: false });
});

// Render the user signup form on POST
exports.user_create_post = [
  // Sanitize user data
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (value: string, { req }: any) => {
      if (await db.findUser(value)) {
        throw new Error("Username already in use");
      }
    }),
  body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirm_password", "Confirm password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value: string, { req }: any) => {
      return value === req.body.password;
    })
    .withMessage("Confirm field does not match password"),
  // Process request with sanitized data
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("signup", {
        errors: errors.array({ onlyFirstError: true }),
      });
    } else {
      // Data from form is valid. Save user.
      bcrypt.hash(
        req.body.password,
        10,
        async (err: Error, hashedPassword: string) => {
          // if err, do something
          // otherwise, store hashedPassword in DB
          db.createUser(req.body.username, hashedPassword);
        }
      );
      res.redirect("/");
    }
  }),
];

exports.user_login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/",
      session: true,
    })(req, res, next);
  }
);

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
