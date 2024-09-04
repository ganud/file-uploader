import express = require("express");
import session = require("express-session");
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import path = require("path");
const userRouter = require("./routes/userRouter");
const fileRouter = require("./routes/fileRouter");
const { passport } = require("./localstrategy");

var bodyParser = require("body-parser");

var app = express();

app.use(
  session({
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    saveUninitialized: true,
    secret: "a santa at nasa",
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Serve static files from the 'public' directory
app.use(passport.session());

// Note that path join middleware MUST be placed last, or authentication breaks for some reason
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/", userRouter);
app.use("/", fileRouter);

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => console.log("app listening on port 3000!"));
