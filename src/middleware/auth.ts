import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.use(
  new BearerStrategy(async (accessToken, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          accessToken: accessToken,
        },
      });
      if (!user) {
        return done(null, false);
      }
      return done(null, user, { scope: "all" });
    } catch (error) {
      return done(error);
    }
  })
);

export default passport;
