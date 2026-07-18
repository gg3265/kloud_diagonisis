import { Router, type IRouter } from "express";
import healthRouter from "./health";
import testsRouter from "./tests";
import locationsRouter from "./locations";
import bookingsRouter from "./bookings";
import prescriptionsRouter from "./prescriptions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(testsRouter);
router.use(locationsRouter);
router.use(bookingsRouter);
router.use(prescriptionsRouter);

export default router;
