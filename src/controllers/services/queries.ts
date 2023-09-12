import { Prisma, PrismaClient } from "@prisma/client";
import { MutateServiceDTO, ServiceDTO } from "./types";

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

export const createService = (
  prismaClient: PrismaClient,
  dto: MutateServiceDTO
): Prisma.PrismaPromise<ServiceDTO> => {
  return prismaClient.service.create({
    data: {
      ...dto,
    },
  });
};
