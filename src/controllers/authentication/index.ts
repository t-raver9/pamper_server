import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, Venue, VenueAdmin } from "@prisma/client";
import {
  createUser,
  createVenue,
  createVenueAdmin,
  getUserByEmail,
  updateUserAccessToken,
} from "./queries";
import { SignupDTO } from "./types";
import { createSignupDto } from "./transformer";
import { findVenueForUser } from "../users/queries";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, role, firstName, lastName, businessName } =
      req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    let user = await createUser(
      prisma,
      email,
      passwordHash,
      firstName,
      lastName,
      role
    );

    let venue: Venue | undefined = undefined;
    // If role is related to a business, then create a Venue and VenueAdmin
    if (
      role === "PROVIDER_ADMIN" ||
      role === "VENUE_ADMIN" ||
      role === "SOLE_TRADER"
    ) {
      let isSoleTrader = false;
      if (role === "SOLE_TRADER") {
        isSoleTrader = true;
      }

      venue = await createVenue(prisma, businessName, isSoleTrader);
      await createVenueAdmin(prisma, user.id, venue.id);
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    user = await updateUserAccessToken(prisma, user.id, accessToken);

    const responseObject: SignupDTO = createSignupDto(user, venue);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 900000),
      })
      .status(201)
      .send(responseObject);
  } catch (error) {
    console.error("SIGN UP ERROR:", error);
    res.status(500).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    let user = await getUserByEmail(prisma, email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: accessToken,
      },
    });

    const venue = await findVenueForUser(prisma, user.id);
    const signupDto: SignupDTO = createSignupDto(user, venue);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 900000),
      })
      .status(201)
      .send(signupDto);
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).send(error);
  }
};
