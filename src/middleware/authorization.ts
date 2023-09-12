import { PrismaClient, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const verifyVenueAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User; // this comes from passport's authentication
  const venueId = req.params.venueId;

  if (!user || !venueId) {
    return res.status(400).json({ error: "User or Venue ID is missing" });
  }

  if (user.role !== "VENUE_ADMIN") {
    return res
      .status(403)
      .json({ error: "User does not have VENUE_ADMIN role" });
  }

  const venueAdmin = await prisma.venueAdmin.findFirst({
    where: {
      userId: user.id,
      venueId: venueId,
    },
  });

  if (!venueAdmin) {
    return res.status(403).json({
      error: "User is not authorized to perform this action for this venue",
    });
  }

  next();
};
