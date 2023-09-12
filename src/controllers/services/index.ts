import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createService, getAllServicesForVenue } from "./queries";
import { MutateServiceDTO } from "./types";

const prisma = new PrismaClient();

export const listServices = async (req: Request, res: Response) => {
  const { venueId } = req.params;

  try {
    const services = await getAllServicesForVenue(prisma, venueId);
    res.status(200).json(services);
  } catch (error) {
    console.error("Error listing services: ", error);
    return res.status(500).json({ error: "Error listing services" });
  }
};

export const postService = async (req: Request, res: Response) => {
  const { venueId } = req.params;
  const { description, price, duration, categoryId, subCategoryId } = req.body;

  const createServiceDTO: MutateServiceDTO = {
    description,
    price: parseFloat(price),
    duration: parseInt(duration),
    categoryId: parseInt(categoryId),
    subCategoryId: parseInt(subCategoryId),
    venueId: venueId,
  };

  try {
    const service = await createService(prisma, createServiceDTO);
    res.status(200).json(service);
  } catch (error) {
    console.error("Error creating service: ", error);
    return res.status(500).json({ error: "Error creating service" });
  }
};
