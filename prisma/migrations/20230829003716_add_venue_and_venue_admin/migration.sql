-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SOLE_TRADER';

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueAdmin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,

    CONSTRAINT "VenueAdmin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VenueAdmin" ADD CONSTRAINT "VenueAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueAdmin" ADD CONSTRAINT "VenueAdmin_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
