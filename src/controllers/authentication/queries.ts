import {
  Prisma,
  PrismaClient,
  Role,
  User,
  Venue,
  VenueAdmin,
} from "@prisma/client";

export const createUser = (
  prismaClient: PrismaClient,
  email: string,
  passwordHash: string,
  firstName: string,
  lastName: string,
  role: string
): Prisma.PrismaPromise<User> => {
  return prismaClient.user.create({
    data: {
      email: email,
      passwordHash: passwordHash,
      role: role as Role,
      firstName: firstName,
      lastName: lastName,
    },
  });
};

export const createVenue = (
  prismaClient: PrismaClient,
  businessName: string,
  isSoleTrader: boolean
): Prisma.PrismaPromise<Venue> => {
  return prismaClient.venue.create({
    data: {
      businessName: businessName,
      isSoleTrader: isSoleTrader,
    },
  });
};

export const createVenueAdmin = (
  prismaClient: PrismaClient,
  userId: string,
  venueId: string
): Prisma.PrismaPromise<VenueAdmin> => {
  return prismaClient.venueAdmin.create({
    data: {
      userId: userId,
      venueId: venueId,
    },
  });
};

export const updateUserAccessToken = (
  prismaClient: PrismaClient,
  userId: string,
  accessToken: string
): Prisma.PrismaPromise<User> => {
  return prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      accessToken: accessToken,
    },
  });
};

export const getUserByEmail = (
  prismaClient: PrismaClient,
  email: string
): Prisma.PrismaPromise<User | null> => {
  return prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });
};
