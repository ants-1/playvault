import express, { Request, Response } from "express";
import passport from "passport";
import initialisePassport from "./passport/initialisePassport";
import session from "express-session";
import bodyParser from "body-parser";
import routes from "./routes/indexRoutes";
import rateLimit from "express-rate-limit";
import cors from "cors";

import { authenticateJWT, AuthRequest } from "./middlewares/authenticateJWT";

const app = express();
const PORT = process.env.PORT || 4000;
const limter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

initialisePassport();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
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
app.use(limter);

app.use("/api/v1", routes);

app.get("/api/profile", authenticateJWT, (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  res.json({ message: "Access granted to profile", userId: authReq.user?.id });
});

app.listen(PORT, () => {
  console.log(`Sever running on http://localhost:${PORT}`);
});
