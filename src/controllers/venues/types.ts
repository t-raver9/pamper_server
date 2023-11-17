import { BusinessHours, HolidayDays } from "@prisma/client";

export type BusinessHoursDTO = BusinessHours;
export type HolidayDaysDTO = HolidayDays;

export type VenueHoursDTO = {
  businessHours: BusinessHoursDTO[];
  holidayDays: HolidayDaysDTO[];
};
