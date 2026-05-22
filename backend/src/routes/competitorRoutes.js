import express from 'express';
import { searchCompetitors } from '../controllers/competitorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/search').get(protect, searchCompetitors);

export default router;
