// queries.ts

import { PrismaClient } from "@prisma/client";
import { BusinessHoursDTO, HolidayDaysDTO } from "./types";

const prisma = new PrismaClient();

export const setVenueBusinessHours = async (
  venueId: string,
  businessHours: BusinessHoursDTO[]
) => {
  console.log("Business hours: ", businessHours);
  // First, remove existing business hours for the venue
  await prisma.businessHours.deleteMany({ where: { venueId } });

  // Then, batch create the new hours
  return await prisma.businessHours.createMany({
    data: businessHours.map((hour) => ({ ...hour, venueId })),
  });
};

export const setVenueHolidayDays = async (
  venueId: string,
  holidays: HolidayDaysDTO[]
) => {
  // First, remove existing holidays for the venue
  await prisma.holidayDays.deleteMany({ where: { venueId } });

  // Then, batch create the new holidays
  return await prisma.holidayDays.createMany({
    data: holidays.map((holiday) => ({ ...holiday, venueId })),
  });
};

export const getVenueBusinessHours = async (
  venueId: string
): Promise<BusinessHoursDTO[]> => {
  return await prisma.businessHours.findMany({
    where: { venueId },
  });
};

export const getVenueHolidayDays = async (
  venueId: string
): Promise<HolidayDaysDTO[]> => {
  return await prisma.holidayDays.findMany({
    where: { venueId },
  });
};
