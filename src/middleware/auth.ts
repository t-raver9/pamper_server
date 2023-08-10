import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as CookieStrategy } from "passport-cookie";

import { PrismaClient } from "@prisma/client";
import e from "express";

const prisma = new PrismaClient();

passport.use(
  new CookieStrategy(
    { cookieName: "accessToken" },
    async (token: any, done: any) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            accessToken: token,
          },
        });
        console.log("Found user: ", user);
        if (!user) {
          console.log("Failed to find user");
          return done(null, false);
        }
        return done(null, user, { scope: "all" });
      } catch (error) {
        console.log("Error occurred while authenticating user: ", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user: any, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id as string,
      },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: {
            googleId: profile.id,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails![0].value,
              firstName: profile.name!.givenName,
              lastName: profile.name!.familyName,
            },
          });
        }
        done(null, user);
      } catch (error) {
        return done(
          new Error("Error occurred while authenticating google user")
        );
      }
    }
  )
);

export default passport;
