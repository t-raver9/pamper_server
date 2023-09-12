export type UserDTO = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  facebookId?: string | null;
  googleId?: string | null;
  role: string;
};

export type VenueDTO = {
  id: string;
  businessName: string;
  isSoleTrader: boolean;
};

export type SignupDTO = {
  user: UserDTO;
  venue?: VenueDTO;
};
