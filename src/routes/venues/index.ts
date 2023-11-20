import express from "express";
import {
  deleteService,
  getVenueAddress,
  listServicesForVenue,
  postAddressForService,
  postService,
} from "../../controllers/services";
import { getVenueHours, setVenueHours } from "../../controllers/venues";
import {
  validateDeleteServiceForVenue,
  validateListServicesForVenue,
  validatePostAddress,
  validatePostServiceForVenue,
  validateSetVenueHours,
} from "./vaildators";

const router = express.Router();

router.get(
  "/:venueId/services",
  validateListServicesForVenue,
  listServicesForVenue
);
router.post("/:venueId/services", validatePostServiceForVenue, postService);
router.delete(
  "/:venueId/services/:serviceId",
  validateDeleteServiceForVenue,
  deleteService
);
router.post("/:venueId/hours", validateSetVenueHours, setVenueHours);
router.get("/:venueId/hours", getVenueHours);
router.post("/:venueId/address", validatePostAddress, postAddressForService);
router.get("/:venueId/address", getVenueAddress);

export default router;
