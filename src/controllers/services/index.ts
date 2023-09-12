import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getAllServicesForVenue } from "./queries";

const prisma = new PrismaClient();

export const listServices = async (req: Request, res: Response) => {
  const { venueId } = req.params;

  try {
    const services = await getAllServicesForVenue(prisma, venueId);
    res.status(200).json(services);
  } catch (error) {
    console.error("Error listing services: ", error);
    return res.status(500).json({ error: "Error listing services" });
  }
};
