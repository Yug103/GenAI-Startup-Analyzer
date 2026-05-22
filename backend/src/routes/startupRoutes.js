import express from 'express';
import { analyzeIdea, getUserReports, getReportById, deleteReport } from '../controllers/startupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/analyze').post(protect, analyzeIdea);
router.route('/user/reports').get(protect, getUserReports);
router.route('/:id').get(protect, getReportById).delete(protect, deleteReport);

export default router;
