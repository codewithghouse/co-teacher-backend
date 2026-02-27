
import express from 'express';
import { handlePdfAnalysis } from '../controllers/pdf-analysis.controller';
import { pdfUpload } from '../config/multer.config';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route   POST /api/analysis/pdf
 * @desc    Production-grade crash-proof PDF analysis
 * @access  Private
 */
router.post('/pdf', authenticate, pdfUpload.single('file'), handlePdfAnalysis);

export default router;
