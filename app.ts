import express = require("express");
import session = require("express-session");
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import path = require("path");
const userRouter = require("./routes/userRouter");
const { strategy } = require("./localstrategy");
import passport = require("passport");
import { DoneCallback } from "passport";
const prisma = new PrismaClient();

var app = express();

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, //ms
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
    secret: "a santa at nasa",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/", userRouter);

app.use(passport.session());

app.listen(3000, () => console.log("app listening on port 3000!"));
