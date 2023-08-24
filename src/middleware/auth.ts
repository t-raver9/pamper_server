import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as CookieStrategy } from "passport-cookie";

import { PrismaClient, Role } from "@prisma/client";
import { Request } from "express";

const prisma = new PrismaClient();

passport.use(
  new CookieStrategy(
    { cookieName: "accessToken", passReqToCallback: true },
    async (req: Request, token: any, done: any) => {
      try {
        const { role } = req.query;

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
        if (user.role !== role) {
          console.log("User role does not match");
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
  console.log("Serializing user: ", user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user ID: ", id);
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
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: {
            googleId: profile.id,
          },
        });

        if (!user) {
          const state = req.query.state as string;

          const { role } = JSON.parse(Buffer.from(state, "base64").toString());

          console.log("ROLE: ", role);

          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails![0].value,
              firstName: profile.name!.givenName,
              lastName: profile.name!.familyName,
              role: role,
            },
          });
        }
        done(null, user);
      } catch (error) {
        console.log("GOOG ERROR: ", error);
        return done(
          new Error("Error occurred while authenticating google user")
        );
      }
    }
  )
);

export default passport;
