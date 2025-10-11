import express from "express";
import passport from "passport";
import initialisePassport from "./passport/initialisePassport";
import session from "express-session";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 4000;

initialisePassport();

app.use(bodyParser.json());
app.use(express.json());
app.use(
  session({
    secret: process.env.TOKEN_SECRET_KEY!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => {
  console.log(`Sever running on http://localhost:${PORT}`);
});
