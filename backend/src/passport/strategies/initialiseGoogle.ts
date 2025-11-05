import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../../lib/prisma";
import { User } from "../../../generated/prisma";

const initaliseGoogleLogin = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile: any, done) => {
        try {
          const email: string | null = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email from Google"), false);

          let user: User | null = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name: profile.displayName,
                email: profile.emails[0].value,
                password: "",
              },
            });
          }

          return done(null, user);
        } catch (error: any) {
          console.error("Google Authentication Error:", error);
          return done(error, false);
        }
      }
    )
  );
};

export default initaliseGoogleLogin;
