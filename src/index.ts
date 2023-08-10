import express, { Express, Request, Response } from "express";
import { config } from "./config";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import passport from "./middleware/auth";
import session from "express-session";
const cookieParser = require("cookie-parser");

import { User } from "@prisma/client";

const app: Express = express();
const prisma = new PrismaClient();

app.use(passport.initialize());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(cookieParser());

// Fix this for prod environments
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  res.send("Homepage");
});

app.post("/signup", async (req: Request, res: Response) => {
  console.log("Signing up with req.body: ", req.body);
  try {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
      },
    });

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    user.accessToken = accessToken;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: accessToken,
      },
    });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
      })
      .status(201)
      .send("User signed up");
  } catch (error) {
    console.log("SIGN UP ERROR:", error);
    res.status(500).send(error);
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Should throw a 500 if the password isn't there
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    user.accessToken = accessToken;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: accessToken,
      },
    });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
      })
      .status(201)
      .send("User logged in");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get(
  "/users/current",
  passport.authenticate("cookie", { session: false }),
  async (req: Request, res: Response) => {
    const reqUser = req.user as User;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: reqUser.id,
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error occurred while retrieving user" });
    }
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const user = req.user as User;
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: accessToken,
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });
    res.redirect(process.env.CLIENT_URL!);
  }
);

app.listen(config.server.port, () => {
  return console.log(`[server]: Server is running on ${config.server.port}`);
});
