import passport from "passport";
import { Request } from "express";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { User } from "../../../generated/prisma";

const initialiseSignUp = (): void => {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req: Request, email: string, password: string, done: Function) => {
        try {
          const { name } = req.body;
          const hashedPassword: string = await bcrypt.hash(password, 10);

          const existingUser: User | null = await prisma.user.findUnique({
            where: { email },
          });

          if (existingUser) {
            return done(null, false, { message: "Email already registered." });
          }

          const newUser: User = await prisma.user.create({
            data: {
              email,
              name,
              password: hashedPassword,
            },
          });

          return done(null, newUser);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};

export default initialiseSignUp;
