import { Address, Service } from "@prisma/client";

export type ServiceDTO = Service;

export type MutateServiceDTO = Omit<ServiceDTO, "id">;

export type PaginatedServicesDTO = {
  services: ServiceDTO[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  nextPage?: number | null;
  previousPage?: number | null;
};

export type BaseAddressDTO = Omit<Address, "id">;
export type UpsertAddressDTO = Partial<Pick<Address, "id">> & BaseAddressDTO;
export type FullAddressDTO = Address;
