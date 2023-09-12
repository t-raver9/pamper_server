import express from "express";
import { listServices, postService } from "../../controllers/services";
import {
  validateListServicesForVenue,
  validatePostServiceForVenue,
} from "./vaildators";

const router = express.Router();

router.get("/:venueId/services", validateListServicesForVenue, listServices);
router.post("/:venueId/services", validatePostServiceForVenue, postService);

export default router;
