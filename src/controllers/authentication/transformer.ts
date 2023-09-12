import { User, Venue } from "@prisma/client";
import { SignupDTO } from "./types";

export const createSignupDto = (user: User, venue?: Venue | null) => {
  const signupDto: SignupDTO = {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      facebookId: user.facebookId,
      googleId: user.googleId,
      role: user.role,
    },
    venue: undefined,
  };

  if (venue) {
    signupDto.venue = {
      id: venue.id,
      businessName: venue.businessName,
      isSoleTrader: venue.isSoleTrader,
    };
  }
  return signupDto;
};
