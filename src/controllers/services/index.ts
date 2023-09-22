import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  countServices,
  createService,
  deleteServiceByServiceId,
  getAllServicesForVenue,
  listServicesQuery,
} from "./queries";
import { MutateServiceDTO } from "./types";
import { transformToPaginatedServicesDTO } from "./transformer";

const prisma = new PrismaClient();

export const listServicesForVenue = async (req: Request, res: Response) => {
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

export const deleteService = async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  try {
    await deleteServiceByServiceId(prisma, serviceId);
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    console.error("Error deleting service: ", error);
    return res.status(500).json({ error: "Error deleting service" });
  }
};

export const listServices = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    categoryId,
    subCategoryId,
  } = req.query as {
    page?: string;
    limit?: string;
    categoryId?: string;
    subCategoryId?: string;
  };

  const parsedCategoryId = categoryId ? parseInt(categoryId) : undefined;
  const parsedSubCategoryId = subCategoryId
    ? parseInt(subCategoryId)
    : undefined;

  try {
    const services = await listServicesQuery(prisma, {
      page: parseInt(page),
      limit: parseInt(limit),
      categoryId: parsedCategoryId ? parsedCategoryId : undefined,
      subCategoryId: parsedSubCategoryId ? parsedSubCategoryId : undefined,
    });

    const totalRecords = await countServices(prisma, {
      categoryId: parsedCategoryId ? parsedCategoryId : undefined,
      subCategoryId: parsedSubCategoryId ? parsedSubCategoryId : undefined,
    });

    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const transformedData = transformToPaginatedServicesDTO({
      services,
      currentPage: parseInt(page),
      totalPages,
    });

    res.status(200).json(transformedData);
  } catch (error) {
    return res.status(500).json({ error: "Error listing services" });
  }
};
