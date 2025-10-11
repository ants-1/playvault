import express, { Request, Response } from "express";
import passport from "passport";
import initialisePassport from "./passport/initialisePassport";
import session from "express-session";
import bodyParser from "body-parser";
import routes from "./routes/indexRoutes";

import { authenticateJWT, AuthRequest } from "./middlewares/authenticateJWT";

const app = express();
const PORT = process.env.PORT || 4000;

initialisePassport();

app.use(bodyParser.json());
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET!,
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

app.use("/api/v1", routes);

app.get("/api/profile", authenticateJWT, (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  res.json({ message: "Access granted to profile", userId: authReq.user?.id });
});


app.listen(PORT, () => {
  console.log(`Sever running on http://localhost:${PORT}`);
});
