import { Prisma, PrismaClient, Venue } from "@prisma/client";

export const findVenueForUser = (
  prismaClient: PrismaClient,
  userId: string
): Prisma.PrismaPromise<Venue | null> => {
  return prismaClient.venue.findFirst({
    where: {
      VenueAdmin: {
        some: {
          userId: userId,
        },
      },
    },
  });
};
