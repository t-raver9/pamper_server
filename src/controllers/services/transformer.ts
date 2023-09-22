import { PaginatedServicesDTO, ServiceDTO } from "./types";

type TransformerInput = {
  services: ServiceDTO[];
  currentPage: number;
  totalPages: number;
};

export const transformToPaginatedServicesDTO = ({
  services,
  currentPage,
  totalPages,
}: TransformerInput): PaginatedServicesDTO => {
  return {
    services,
    totalRecords: services.length,
    totalPages,
    currentPage,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
  };
};
