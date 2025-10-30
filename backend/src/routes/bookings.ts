import { Router } from 'express';
import { createBookingHandler } from '../controllers/bookingController.js';

const router = Router();
router.post('/', createBookingHandler);
export default router;
