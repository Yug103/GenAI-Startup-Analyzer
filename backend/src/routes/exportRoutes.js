import express from 'express';
import { exportPdf } from '../controllers/exportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/pdf/:id').get(protect, exportPdf);

export default router;
