import { Strategy as LocalStrategy } from "passport-local";
const db = require("./db/queries");
var bcrypt = require("bcryptjs");
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import passport = require("passport");
import { DoneCallback } from "passport";

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await db.findUser(username);
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    // Compare password hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // passwords do not match!
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

passport.use(strategy);

passport.serializeUser((user: any, done: DoneCallback) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done: DoneCallback) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = {
  passport,
};
