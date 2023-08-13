import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import passport from "../middleware/auth";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
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
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 900000),
      })
      .status(201)
      .send("User signed up");
  } catch (error) {
    console.error("SIGN UP ERROR:", error);
    res.status(500).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

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

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 900000),
      })
      .status(201)
      .send("User logged in");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const reqUser = req.user as User;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: reqUser.id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error occurred while retrieving user" });
  }
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = async (req: Request, res: Response) => {
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
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 900000),
  });
  res.redirect(process.env.CLIENT_URL!);
};
