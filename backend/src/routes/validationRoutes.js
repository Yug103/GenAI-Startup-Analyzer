import express from 'express';
import { generateValidationPlans } from '../controllers/validationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/generate').post(protect, generateValidationPlans);

export default router;
