import express from "express";
import {
  deleteService,
  listServicesForVenue,
  postService,
} from "../../controllers/services";
import {
  validateDeleteServiceForVenue,
  validateListServicesForVenue,
  validatePostServiceForVenue,
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

export default router;
