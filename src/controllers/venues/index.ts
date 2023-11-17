import { Request, Response } from "express";
import {
  getVenueBusinessHours,
  getVenueHolidayDays,
  setVenueBusinessHours,
  setVenueHolidayDays,
} from "./queries";
import { VenueHoursDTO } from "./types";

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
