import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, Role, User } from "@prisma/client";
import passport from "../../middleware/authentication";
import { SignupDTO, UserDTO } from "./types";
import { findVenueForUser } from "./queries";
import { createSignupDto } from "./transformer";

const prisma = new PrismaClient();

export const getCurrentUser = async (req: Request, res: Response) => {
  const reqUser = req.user as UserDTO;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: reqUser.id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const venue = await findVenueForUser(prisma, user.id);
    const signupDto: SignupDTO = createSignupDto(user, venue);
    res.json(signupDto);
  } catch (error) {
    res.status(500).json({ error: "Error occurred while retrieving user" });
  }
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = async (req: Request, res: Response) => {
  const user = req.user as User;
  console.log("CALLBACK QUERY: ", req.query);
  console.log("USER:", user);
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      accessToken: accessToken,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 900000),
  });
  res.redirect(process.env.CLIENT_URL! + "/?auth=success");
};
