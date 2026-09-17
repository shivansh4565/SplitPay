import express from 'express';
import {
  getPaymentPartStatus,
  retryPaymentPart
} from '../controllers/paymentController.js';
import {
  paymentStatusLimiter
} from '../middleware/paymentRateLimiter.js';

const router = express.Router();

router.get('/:paymentPartId/status', paymentStatusLimiter, getPaymentPartStatus);
router.post('/:paymentPartId/retry', retryPaymentPart);

export default router;