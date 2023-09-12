import { Service } from "@prisma/client";

export type ServiceDTO = Service;

export type MutateServiceDTO = Omit<ServiceDTO, "id">;
