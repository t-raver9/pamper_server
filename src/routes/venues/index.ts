import express from "express";
import { listServices } from "../../controllers/services";
import { validateListServicesForVenue } from "./vaildators";

const router = express.Router();

router.get("/:venueId/services", validateListServicesForVenue, listServices);

export default router;
