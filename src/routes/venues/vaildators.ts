import { Request, Response, NextFunction } from "express";

export const validateListServicesForVenue = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { venueId } = req.params;

  if (!venueId) {
    return res.status(400).json({ error: "Missing venue ID" });
  }

  next();
};
