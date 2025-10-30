import { Router } from 'express';
import { getExperience, listExperiences } from '../controllers/experienceController.js';

const router = Router();
router.get('/', listExperiences);
router.get('/:id', getExperience);
export default router;
