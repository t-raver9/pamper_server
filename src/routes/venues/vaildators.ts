import { Request, Response, NextFunction } from "express";
import { BusinessHoursDTO } from "../../controllers/venues/types";
import { Weekday } from "@prisma/client";

export const validateListServicesForVenue = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { venueId } = req.params;
  req.body;

  if (!venueId) {
    return res.status(400).json({ error: "Missing venue ID" });
  }

  next();
};

export const validatePostServiceForVenue = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { venueId } = req.params;
  const { description, price, duration, categoryId, subCategoryId } = req.body;

  if (!venueId) {
    return res.status(400).json({ error: "Missing venue ID" });
  }

  if (!description) {
    return res.status(400).json({ error: "Missing description" });
  }

  if (!price) {
    return res.status(400).json({ error: "Missing price" });
  }

  if (!duration) {
    return res.status(400).json({ error: "Missing duration" });
  }

  if (!categoryId) {
    return res.status(400).json({ error: "Missing category ID" });
  }

  if (!subCategoryId) {
    return res.status(400).json({ error: "Missing subcategory ID" });
  }

  next();
};

export const validateDeleteServiceForVenue = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { venueId, serviceId } = req.params;

  if (!venueId) {
    return res.status(400).json({ error: "Missing venue ID" });
  }

  if (!serviceId) {
    return res.status(400).json({ error: "Missing service ID" });
  }

  next();
};

export const validateSetVenueHours = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { venueId } = req.params;
  const { businessHours, holidayDays } = req.body;

  console.log("Regular hours:", businessHours);
  console.log("holidayDays:", holidayDays);

  if (!venueId) {
    return res.status(400).json({ error: "Missing venue ID" });
  }

  if (
    !businessHours ||
    !Array.isArray(businessHours) ||
    businessHours.length !== 7
  ) {
    return res.status(400).json({ error: "Invalid regular hours data" });
  }

  if (!holidayDays || !Array.isArray(holidayDays)) {
    return res.status(400).json({ error: "Invalid holidayDays data" });
  }

  const businessHoursDays = businessHours.map((hour) => hour.day);
  // Validate each day
  for (const day of businessHoursDays) {
    if (!isValidWeekday(day)) {
      return res.status(400).json({ error: `Invalid weekday: ${day}` });
    }
  }

  next();
};

const isValidWeekday = (value: string): value is Weekday => {
  return Object.values(Weekday).includes(value as Weekday);
};
