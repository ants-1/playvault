import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

const initialiseLogin = (): void => {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done: Function) => {
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return done(null, false, { message: "Unable to find user." });
          }

          const matchedPassword = await bcrypt.compare(password, user.password);

          if (!matchedPassword) {
            return done(null, false, { message: "Invalid password " });
          }

          return done(null, user);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done: Function) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default initialiseLogin;
