import { Request, Response, NextFunction } from "express";

export const validateListServicesForVenue = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { venueId } = req.params;
  req.body;

  if (!venueId) {
    return res.status(400).json({ error: "Missing venue ID" });
  }

  next();
};

export const validatePostServiceForVenue = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { venueId } = req.params;
  const { description, price, duration, categoryId, subCategoryId } = req.body;

  if (!venueId) {
    return res.status(400).json({ error: "Missing venue ID" });
  }

  if (!description) {
    return res.status(400).json({ error: "Missing description" });
  }

  if (!price) {
    return res.status(400).json({ error: "Missing price" });
  }

  if (!duration) {
    return res.status(400).json({ error: "Missing duration" });
  }

  if (!categoryId) {
    return res.status(400).json({ error: "Missing category ID" });
  }

  if (!subCategoryId) {
    return res.status(400).json({ error: "Missing subcategory ID" });
  }

  next();
};

export const validateDeleteServiceForVenue = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { venueId, serviceId } = req.params;

  if (!venueId) {
    return res.status(400).json({ error: "Missing venue ID" });
  }

  if (!serviceId) {
    return res.status(400).json({ error: "Missing service ID" });
  }

  next();
};
