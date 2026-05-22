import express from 'express';
import { getMarketInsights } from '../controllers/marketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/insights').get(protect, getMarketInsights);

export default router;
