import { Router } from 'express';
import { validatePromoHandler } from '../controllers/promoController.js';

const router = Router();
router.post('/validate', validatePromoHandler);
export default router;
