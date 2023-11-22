import { Request, Response } from "express";
import {
  getVenueBusinessHours,
  getVenueHolidayDays,
  getVenuesInBounds,
  setVenueBusinessHours,
  setVenueHolidayDays,
} from "./queries";
import { VenueHoursDTO } from "./types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BoundsQuery {
  north: string;
  south: string;
  east: string;
  west: string;
}

export const listVenuesInBounds = async (req: Request, res: Response) => {
  const { north, south, east, west } = req.query as unknown as BoundsQuery;

  try {
    const venues = await getVenuesInBounds(prisma, {
      north: parseFloat(north),
      south: parseFloat(south),
      east: parseFloat(east),
      west: parseFloat(west),
    });
    res.status(200).json(venues);
  } catch (error) {
    console.error("Error listing venues: ", error);
    return res.status(500).json({ error: "Error listing venues" });
  }
};

export const setVenueHours = async (req: Request, res: Response) => {
  const { venueId } = req.params;
  const { businessHours, holidayDays } = req.body;

  try {
    await setVenueBusinessHours(venueId, businessHours);
    await setVenueHolidayDays(venueId, holidayDays);
    res.status(200).json({ message: "Venue hours updated successfully" });
  } catch (error) {
    console.error("Error updating venue hours: ", error);
    return res.status(500).json({ error: "Error updating venue hours" });
  }
};

export const getVenueHours = async (req: Request, res: Response) => {
  const { venueId } = req.params;

  try {
    const businessHours = await getVenueBusinessHours(venueId);
    const holidayDays = await getVenueHolidayDays(venueId);

    const hours: VenueHoursDTO = {
      businessHours,
      holidayDays,
    };

    res.status(200).json(hours);
  } catch (error) {
    console.error("Error fetching venue hours: ", error);
    return res.status(500).json({ error: "Error fetching venue hours" });
  }
};
