import { Prisma, PrismaClient } from "@prisma/client";
import { ServiceDTO } from "./types";

export const getAllServicesForVenue = (
  prismaClient: PrismaClient,
  venueId: string
): Prisma.PrismaPromise<ServiceDTO[]> => {
  return prismaClient.service.findMany({
    where: {
      venueId: venueId,
    },
  });
};
