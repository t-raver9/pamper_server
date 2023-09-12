import { User } from "@prisma/client";

export type SignupDTO = {
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    facebookId?: string | null;
    googleId?: string | null;
    role: string;
  };
  venue?: {
    id: string;
    businessName: string;
    isSoleTrader: boolean;
  };
};
