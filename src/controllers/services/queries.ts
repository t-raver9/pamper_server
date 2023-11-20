import { Prisma, PrismaClient } from "@prisma/client";
import { MutateServiceDTO, ServiceDTO, UpsertAddressDTO } from "./types";

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

export const deleteServiceByServiceId = (
  prismaClient: PrismaClient,
  serviceId: string
): Prisma.PrismaPromise<ServiceDTO> => {
  return prismaClient.service.delete({
    where: {
      id: parseInt(serviceId),
    },
  });
};

export const listServicesQuery = (
  prismaClient: PrismaClient,
  options: {
    page: number;
    limit: number;
    categoryId?: number;
    subCategoryId?: number;
  }
): Prisma.PrismaPromise<ServiceDTO[]> => {
  const skip = (options.page - 1) * options.limit;
  const take = options.limit;

  return prismaClient.service.findMany({
    skip,
    take,
    where: {
      ...(options.categoryId && { categoryId: options.categoryId }),
      ...(options.subCategoryId && { subCategoryId: options.subCategoryId }),
    },
  });
};

// Used to calculate total pages for pagination
export const countServices = (
  prismaClient: PrismaClient,
  options: {
    categoryId?: number;
    subCategoryId?: number;
  }
): Prisma.PrismaPromise<number> => {
  return prismaClient.service.count({
    where: {
      ...(options.categoryId && { categoryId: options.categoryId }),
      ...(options.subCategoryId && { subCategoryId: options.subCategoryId }),
    },
  });
};

export const upsertAddressForService = (
  prismaClient: PrismaClient,
  dto: UpsertAddressDTO
) => {
  return prismaClient.address.upsert({
    where: {
      venueId: dto.venueId,
    },
    update: {
      ...dto,
    },
    create: {
      ...dto,
    },
  });
};

export const getVenueAddressQuery = (
  prismaClient: PrismaClient,
  venueId: string
) => {
  return prismaClient.address.findFirst({
    where: {
      venueId: venueId,
    },
  });
};
